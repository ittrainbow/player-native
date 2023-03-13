import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
// import * as NavigationBar from 'expo-navigation-bar'

import { AudioListItem } from '../components/AudioListItem'
import { color } from '../misc/color'
import { getListItemText, getListItemTime } from '../helpers/audioListItemHelpers'
import { PlaylistModal } from '../components/PlaylistModal'

const { BG } = color

export class AudioList extends Component {
  static contextType = AudioContext

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      currentItem: null,
      currentTrackName: null,
      currentItem: {}
    }

    this.currentItem = {}
  }

  layoutProvider = new LayoutProvider(
    (index) => 'audio',
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 73
    }
  )

  onModalClose = () => {
    this.setState({ ...this.state, modalVisible: false })
    this.currentItem = {}
  }

  rowRenderer = (type, item) => {
    const { filename, duration } = item
    const { letter, trackname } = getListItemText(filename)
    const time = getListItemTime(duration)

    return (
      <AudioListItem
        letter={letter}
        trackname={trackname}
        time={time}
        onPress={() => {
          this.currentItem = item
          this.setState({ ...this.state, modalVisible: true })
        }}
      />
    )
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
              <PlaylistModal
                currentItem={this.currentItem}
                visible={this.state.modalVisible}
                onClose={this.onModalClose}
                onPlayPress={() => console.log('onPlayPress')}
                onPlaylistPress={() => console.log('onPlaylistPress')}
              />
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
    marginBottom: 50,
    backgroundColor: BG
  }
})
