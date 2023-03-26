import AsyncStorage from '@react-native-async-storage/async-storage'

import { initials } from './getInitials'
const { initialPlaylist } = initials

export const getAsync = async (value) => {
  const response = await AsyncStorage.getItem(value)
  const empty = response.length < 10 && value === 'playlist'
  
  if (empty) await AsyncStorage.setItem('playlist', JSON.stringify(initialPlaylist))
  const result = empty ? initialPlaylist : JSON.parse(response)

  return result
}

export const setAsync = async (value, data) => {
  await AsyncStorage.setItem(value, JSON.stringify(data))
}
