export const play = async ({ playbackObject, uri }) => {
  try {
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

export const next = async ({ playbackObject, uri }) => {
  try {
    await playbackObject.stopAsync()
    await playbackObject.unloadAsync()
    return await play({ playbackObject, uri })
  } catch (error) {
    console.error('next track error', error.message)
  }
}
