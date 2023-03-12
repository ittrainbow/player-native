import React, { useEffect } from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'

import Navigator from './app/navigation/Navigator'
import AudioProvider from './app/context/AudioProvider'
import { color } from './app/misc/color'
const { BG } = color

// const navColor = await NavigationBar.getBackgroundColorAsync()
// console.log(navColor)

export const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: BG,
    card: BG,
    text: '#eee'
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
