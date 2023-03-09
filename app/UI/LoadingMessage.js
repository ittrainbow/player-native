import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { getColors } from '../helpers'
const { CREME } = getColors

export const LoadingMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>... data loading</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 50
  },
  text: {
    color: CREME,
    fontSize: 20,
    fontWeight: 700
  }
})
