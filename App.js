import React from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'

import Navigator from './app/navigation/Navigator'
import AudioProvider from './app/context/AudioProvider'
import { color } from './app/misc/color'
const { BG } = color

export default function App() {
  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: BG,
      card: BG,
      text: '#eee'
    }
  }
  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <Navigator />
      </NavigationContainer>
    </AudioProvider>
  )
}
