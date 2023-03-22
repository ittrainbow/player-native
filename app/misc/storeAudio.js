import AsyncStorage from '@react-native-async-storage/async-storage'

export const storeAudioForNextOpening = async (props) => {
  const string = JSON.stringify(props)
  await AsyncStorage.setItem('previousAudio', string)
}
