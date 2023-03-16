import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeAudioForNextOpening = async (audio, index, artist, title) => {
  const string = JSON.stringify({ audio, index, artist, title })
  await AsyncStorage.setItem('previousAudio', string)
}
