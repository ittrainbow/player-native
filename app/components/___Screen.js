import React from 'react'
import { View, StyleSheet } from 'react-native'

import { color } from '../misc'

const { BG } = color

export const Screen = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG
  }
})
