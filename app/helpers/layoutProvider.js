import { useRef } from 'react'
import { LayoutProvider } from 'recyclerlistview'
import { Dimensions } from 'react-native'

export const getLayoutProvider = () => {
  return useRef(
    new LayoutProvider(
      (index) => 'audio',
      (type, dim) => {
        dim.width = Dimensions.get('window').width
        dim.height = 68
      }
    )
  ).current
}
