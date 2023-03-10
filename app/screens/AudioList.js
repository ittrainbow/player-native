import React, { Component } from 'react'
import { Text, ScrollView, StyleSheet } from 'react-native'
import { AudioContext } from '../context/AudioProvider'

export class AudioList extends Component {
  static contextType = AudioContext

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {this.context.audioFiles.map((item) => {
          const { id, filename } = item
          const trackname = filename.split('.mp3')[0]
          return (
            <Text style={styles.song} key={id}>
              {trackname}
            </Text>
          )
        })}
        <Text>Audio List</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink'
  },
  song: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 2
  }
})
