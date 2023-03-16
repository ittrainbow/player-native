import React, { useEffect, useContext } from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { AudioContext } from '../context/AudioProvider'

export const Playlist = () => {
  const context = useContext(AudioContext)
  const { currentArtist, currentTitle } = context

  return (
    <View style={styles.container}>
      <Text>Playlist</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
