import AsyncStorage from '@react-native-async-storage/async-storage'

export const getAsync = async (value) => {
  const response = await AsyncStorage.getItem(value)
  return JSON.parse(response)
}

export const setAsync = async (value, data) => {
  await AsyncStorage.setItem(value, JSON.stringify(data))
}