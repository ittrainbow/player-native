import { setAsync } from './async'

export const play = async ({ playbackObject, audio, index }) => {
  const { uri } = audio
  try {
    await setAsync('previousAudio', { audio, index })
    return await playbackObject.loadAsync(
      { uri },
      { shouldPlay: true }
    )
  } catch (error) {
    console.error('PLAY in Controller', error.message)
  }
}

export const pause = async (playbackObject) => {
  try {
    return await playbackObject.setStatusAsync({ shouldPlay: false })
  } catch (error) {
    console.error('PAUSE in Controller', error.message)
  }
}

export const resume = async (playbackObject) => {
  try {
    return await playbackObject.playAsync()
  } catch (error) {
    console.error('RESUME in Controller', error.message)
  }
}

export const next = async (props) => {
  const { playbackObject, audio, index } = props
  try {
    await setAsync('previousAudio', { audio, index })
    await playbackObject.stopAsync()
    await playbackObject.unloadAsync()
    return await play(props)
  } catch (error) {
    console.error('NEXT TRACK in Controller', error.message)
  }
}

export const playpause = async ({ audio, context }) => {
  const {
    soundObject,
    playbackObject,
    currentAudio,
    audioFiles,
    onPlaybackStatusUpdate,
    setCurrentAudio,
    setSoundObject,
    setIsPlaying,
    setCurrentAudioIndex,
    setPlaybackPosition
  } = context
  const index = audioFiles.indexOf(audio)

  try {
    if (soundObject === null) {
      const status = await play({ playbackObject, audio, index })

      setCurrentAudio(audio)
      setSoundObject(status)
      setIsPlaying(true)
      setCurrentAudioIndex(index)
      return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    } else {
      const { isLoaded, isPlaying } = soundObject
      const { id } = currentAudio

      if (isLoaded && id === audio.id) {
        if (isPlaying) {
          const status = await pause(playbackObject)

          const { positionMillis } = status
          setSoundObject(status)
          setIsPlaying(false)
          setPlaybackPosition(positionMillis)
        } else {
          const status = await resume(playbackObject)

          setSoundObject(status)
          setIsPlaying(true)
        }
      } else if (id !== audio.id) {
        const status = await next({ playbackObject, audio, index })

        setCurrentAudio(audio)
        setSoundObject(status)
        setIsPlaying(true)
        setCurrentAudioIndex(index)
      }
    }
  } catch (error) {
    console.error('PLAYPAUSE in Controller', error.message)
  }
}

export const prevnext = async ({ value, context, nextAudio }) => {
  const {
    playbackObject,
    currentAudioIndex,

    onPlaybackStatusUpdate,
    totalCount,
    setPlaybackObject,
    setCurrentAudio,
    setCurrentAudioIndex,
    setSoundObject,
    setIsPlaying
  } = context
  try {
    const prev = value === 'prev'
    const counter = prev ? -1 : 1
    const { isLoaded } = await playbackObject.getStatusAsync()
    const endOfList = prev ? currentAudioIndex === 0 : currentAudioIndex + counter === totalCount
    const index = prev
      ? endOfList
        ? totalCount + counter
        : currentAudioIndex + counter
      : endOfList
      ? 0
      : currentAudioIndex + counter
    const audio = nextAudio

    const objToPlay = { playbackObject, audio, index }
    const status = !isLoaded ? await play(objToPlay) : await next(objToPlay)

    setCurrentAudio(audio)
    setCurrentAudioIndex(index)
    setPlaybackObject(playbackObject)
    setIsPlaying(true)
    setSoundObject(status)
    return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
  } catch (error) {
    console.error('PREVNEXT in Controller', error.message)
  }
}
