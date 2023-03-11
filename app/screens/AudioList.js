import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem'

import { color } from '../misc/color'
const { BG } = color

export class AudioList extends Component {
  static contextType = AudioContext
  layoutProvider = new LayoutProvider(
    (index) => 'audio',
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 73
    }
  )

  rowRenderer = (type, item) => {
    const { filename, duration } = item
    return <AudioListItem filename={filename} duration={duration} />
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <View style={styles.container}>
              <RecyclerListView style={styles.view}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
            </View>
          )
        }}
      </AudioContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  view: {
    width: Dimensions.get('window').width,
    marginBottom: 95,
    backgroundColor: BG,
  }
})
