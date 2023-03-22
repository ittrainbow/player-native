import React from 'react'
import { IconButton } from '@react-native-material/core'
import { MaterialIcons } from '@expo/vector-icons'

import { color } from '../misc/color'
const { MAIN } = color

const PlayerButton = (props) => {
  const { iconType, size = 40, color = MAIN, onPress } = props
  const getIcon = () => {
    switch (iconType) {
      case 'PREV':
        return 'skip-previous'
      case 'PLAY':
        return 'play-arrow'
      case 'PAUSE':
        return 'pause'
      case 'NEXT':
        return 'skip-next'
      default:
        return
    }
  }

  return <IconButton onPress={onPress} icon={<MaterialIcons name={getIcon()} size={size} color={color}/>} />
}

export default PlayerButton
