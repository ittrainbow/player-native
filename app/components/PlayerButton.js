import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

import { color } from '../misc/color'
const { MAIN } = color

const PlayerButton = ({ iconType, size = 40, color = MAIN, onPress }) => {
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
  return <MaterialIcons onPress={onPress} name={getIcon()} size={size} color={color} />
}

export default PlayerButton
