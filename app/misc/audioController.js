// import { storeAudioForNextOpening } from './storeAudio'
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

export const playpause = async ({ audio, context }) => {
  const {
    soundObject,
    playbackObject,
    currentAudio,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
    getMetadata
  } = context
  const { uri } = audio
  const { artist, title } = getMetadata(uri)
  const index = audioFiles.indexOf(audio)

  try {
    if (soundObject === null) {
      const status = await play({ playbackObject, uri, audio, index, artist, title })
      const newState = {
        currentAudio: audio,
        soundObject: status,
        isPlaying: true,
        currentAudioIndex: index
      }

      updateState(context, newState)
      return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    } else {
      const { isLoaded, isPlaying } = soundObject
      const { id } = currentAudio

      if (isLoaded && id === audio.id) {
        if (isPlaying) {
          const status = await pause(playbackObject)
          const newState = {
            soundObject: status,
            isPlaying: false,
            playbackPosition: status.positionMillis
          }

          return updateState(context, newState)
        } else {
          const status = await resume(playbackObject)
          const newState = { soundObject: status, isPlaying: true }

          return updateState(context, newState)
        }
      } else if (id !== audio.id) {
        const status = await next({ playbackObject, uri, audio, index, artist, title })
        const newState = {
          currentAudio: audio,
          soundObject: status,
          isPlaying: true,
          currentAudioIndex: index
        }

        return updateState(context, newState)
      }
    }
  } catch (error) {
    console.error('audio controller select audio method error', error.message)
  }
}

export const prevnext = async ({ value, context, nextAudio }) => {
  const {
    playbackObject,
    currentAudioIndex,
    updateState,
    onPlaybackStatusUpdate,
    totalCount,
    getMetadata
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

    const newState = {
      currentAudio: audio,
      currentAudioIndex: index,
      playbackObject,
      isPlaying: true,
      soundObject: status
    }

    playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    return updateState(context, newState)
  } catch (error) {
    console.error('audio controller prev/next method error', error.message)
  }
}
