import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export const Playlist = () => {
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
