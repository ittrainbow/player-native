import React from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { StatusBar } from 'react-native'
import { usePreventScreenCapture } from 'expo-screen-capture'

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

  usePreventScreenCapture()

  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar backgroundColor={BG} />
        <Navigator />
      </NavigationContainer>
    </AudioProvider>
  )
}
