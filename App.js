import React from 'react'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { StatusBar } from 'react-native'

import Navigator from './app/navigation/Navigator'
import ContextProvider from './app/context/Context'
import { getColors } from './app/helpers'

const { BG } = getColors

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
    <ContextProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar backgroundColor={BG} />
        <Navigator />
      </NavigationContainer>
    </ContextProvider>
  )
}
