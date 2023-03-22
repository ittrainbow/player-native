import { storeAudioForNextOpening } from './storeAudio'

export const play = async ({ playbackObject, uri, audio, index, artist, title }) => {
  try {
    await storeAudioForNextOpening({ audio, index, artist, title })
    return await playbackObject.loadAsync({ uri }, { shouldPlay: true })
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
    await storeAudioForNextOpening({ audio, index, artist, title })
    await playbackObject.stopAsync()
    await playbackObject.unloadAsync()
    return await play(props)
  } catch (error) {
    console.error('next track error', error.message)
  }
}
