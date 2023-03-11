import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'

import Navigator from './app/navigation/Navigator'
import AudioProvider from './app/context/AudioProvider'
import { color } from './app/misc/color'
const { BG } = color

export const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BG,
    card: BG,
    text: '#eee',
  }
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <Navigator />
      </NavigationContainer>
    </AudioProvider>
  )
}
