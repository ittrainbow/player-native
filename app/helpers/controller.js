import { setAsync } from './async'

export const play = async ({ playbackObject, uri, audio, index, artist, title }) => {
  try {
    // await storeAudioForNextOpening({ audio, index, artist, title })
    await setAsync('previousAudio', { audio, index, artist, title })
    return await playbackObject.loadAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    )
  } catch (error) {
    console.error('play start error', error.message)
  }
}

export const pause = async (playbackObject) => {
  try {
    return await playbackObject.setStatusAsync({ shouldPlay: false })
  } catch (error) {
    console.error('pause error', error.message)
  }
}

export const resume = async (playbackObject) => {
  try {
    return await playbackObject.playAsync()
  } catch (error) {
    console.error('resume error', error.message)
  }
}

export const next = async (props) => {
  const { playbackObject, audio, index, artist, title } = props
  try {
    // await storeAudioForNextOpening({ audio, index, artist, title })
    await setAsync('previousAudio', { audio, index, artist, title })
    await playbackObject.stopAsync()
    await playbackObject.unloadAsync()
    return await play(props)
  } catch (error) {
    console.error('next track error', error.message)
  }
}

export const playpause = async ({ audio, context, isPlaylist }) => {
  const {
    soundObject,
    playbackObject,
    currentAudio,
    // update1State,
    audioFiles,
    onPlaybackStatusUpdate,
    getMetadata,
    //
    setCurrentAudio,
    setSoundObject,
    setIsPlaylist,
    setIsPlaying,
    setCurrentAudioIndex,
    setPlaybackPosition
  } = context
  const { uri } = audio
  const { artist, title } = getMetadata(uri)
  const index = audioFiles.indexOf(audio)
  console.log(100, uri, artist, title)

  try {
    if (soundObject === null) {
      console.log(101, 'soundobject === null')
      const status = await play({ playbackObject, uri, audio, index, artist, title })
      // const newState = {
      //   currentAudio: audio,
      //   soundObject: status,
      //   isPlaylist,
      //   isPlaying: true,
      //   currentAudioIndex: index
      // }

      // update1State(context, newState)
      setCurrentAudio(audio)
      setSoundObject(status)
      setIsPlaylist(isPlaylist)
      setIsPlaying(true)
      setCurrentAudioIndex(index)
      return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    } else {
      console.log(102, 'soundobject !== null')
      const { isLoaded, isPlaying } = soundObject
      const { id } = currentAudio

      if (isLoaded && id === audio.id) {
        console.log(103, 'isLoaded && id === audio.id')
        if (isPlaying) {
          console.log(104, 'isPlaying')
          const status = await pause(playbackObject)
          // const newState = {
          //   soundObject: status,
          //   isPlaylist,
          //   isPlaying: false,
          //   playbackPosition: status.positionMillis
          // }

          // return update1State(context, newState)
          const { positionMillis } = status
          setSoundObject(status)
          setIsPlaylist(isPlaylist)
          setIsPlaying(false)
          setPlaybackPosition(positionMillis)
        } else {
          console.log(105, '!isPlaying')
          const status = await resume(playbackObject)
          // const newState = { soundObject: status, isPlaying: true }

          // return update1State(context, newState)
          setSoundObject(status)
          setIsPlaying(true)
        }
      } else if (id !== audio.id) {
        console.log(106, 'id !== audio.id')
        const status = await next({ playbackObject, uri, audio, index, artist, title })
        // const newState = {
        //   currentAudio: audio,
        //   soundObject: status,
        //   isPlaying: true,
        //   isPlaylist,
        //   currentAudioIndex: index
        // }

        // return update1State(context, newState)
        setCurrentAudio(audio)
        setSoundObject(status)
        setIsPlaying(true)
        setIsPlaylist(isPlaylist)
        setCurrentAudioIndex(index)
      }
    }
  } catch (error) {
    console.error('audio controller select audio method error', error.message)
  }
}

export const prevnext = async ({ value, context, nextAudio }) => {
  console.log(190, context.currentAudioIndex)
  const {
    playbackObject,
    currentAudioIndex,
    // update1State,
    onPlaybackStatusUpdate,
    totalCount,
    getMetadata,
    setPlaybackObject,
    setCurrentAudio,
    setCurrentAudioIndex,
    setSoundObject,
    setIsPlaying
  } = context
  try {
    const prev = value === 'prev'
    console.log(200, prev)
    const counter = prev ? -1 : 1
    const { isLoaded } = await playbackObject.getStatusAsync()
    console.log(201, isLoaded)
    const endOfList = prev ? currentAudioIndex === 0 : currentAudioIndex + counter === totalCount
    console.log(202, endOfList)
    console.log(203, prev, endOfList, totalCount, counter, currentAudioIndex)
    const index = prev
      ? endOfList
        ? totalCount + counter
        : currentAudioIndex + counter
      : endOfList
      ? 0
      : currentAudioIndex + counter
    console.log(204, index)
    const audio = nextAudio
    console.log(205, audio)
    const { uri } = audio
    const { artist, title } = getMetadata(uri)

    let status
    if (!isLoaded && !endOfList) {
      status = await play({ playbackObject, uri, audio, index, artist, title })
    } else if (isLoaded && !endOfList) {
      status = await next({ playbackObject, uri, audio, index, artist, title })
    } else if (isLoaded && endOfList) {
      status = await next({ playbackObject, uri, audio, index, artist, title })
    }
    console.log(204, status)

    // const newState = {
    //   currentAudio: audio,
    //   currentAudioIndex: index,
    //   playbackObject,
    //   isPlaying: true,
    //   soundObject: status
    // }

    setCurrentAudio(audio)
    setCurrentAudioIndex(index)
    setPlaybackObject(playbackObject)
    setIsPlaying(true)
    setSoundObject(status)
    return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    // return update1State(context, newState)
  } catch (error) {
    console.error('audio controller prev/next method error', error.message)
  }
}
