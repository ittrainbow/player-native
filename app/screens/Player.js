import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export const Player = () => {
  return (
    <View style={styles.container}>
      <Text>Player</Text>
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
