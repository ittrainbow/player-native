import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import Navigator from './app/navigation/Navigator'
import AudioProvider from './app/context/AudioProvider'

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </AudioProvider>
  )
}
