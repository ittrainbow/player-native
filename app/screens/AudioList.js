import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'

import AudioListItem from '../components/AudioListItem'
import Screen from '../components/Screen'
import { color } from '../misc/color'
import PlaylistModal from '../components/PlaylistModal'
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

  getListItemText(filename) {
    const letterNum = /[a-zA-Zа-яА-Я]/i.exec(filename).index

    const letter = filename.charAt(letterNum).toUpperCase()
    const trackname = filename.replace('.mp3', '').substring(letterNum)

    return { letter, trackname }
  }

  getListItemTime(duration) {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration) - 60 * minutes
    const leadZero = (val) => (val < 9 ? '0' : '')
    const time = `${leadZero(minutes)}${minutes}:${leadZero(seconds)}${seconds}`

    return time
  }

  rowRenderer = (type, item) => {
    const { filename, duration } = item
    const { letter, trackname } = this.getListItemText(filename)
    const time = this.getListItemTime(duration)

    const onPress = () => {
      console.log('onPress')
    }
    return <AudioListItem letter={letter} trackname={trackname} time={time} onPress={onPress} />
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <>
              <RecyclerListView
                style={styles.view}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
              <PlaylistModal visible={false} />
            </>
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
    alignItems: 'center'
  },
  view: {
    width: Dimensions.get('window').width,
    marginBottom: 95,
    backgroundColor: BG
  }
})
