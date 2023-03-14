import React, { Component } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'

import { AudioListItem } from '../components/AudioListItem'
import { color } from '../misc/color'
import { getListItemText, getListItemTime } from '../helpers/audioListItemHelpers'
import { PlaylistModal } from '../components/PlaylistModal'
import { play, pause, resume, next } from '../misc/audioController'

const { BG } = color

export class AudioList extends Component {
  static contextType = AudioContext

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
      // currentItem: null,
      // currentTrackName: null,
    }

    this.currentItem = {}
  }

  layoutProvider = new LayoutProvider(
    (index) => 'audio',
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 68
    }
  )

  onModalClose = () => {
    this.setState({ ...this.state, modalVisible: false })
    this.currentItem = {}
  }

  onPressHandler = (item) => {
    this.currentItem = item
    this.setState({ ...this.state, modalVisible: true })
  }

  audioPressHandler = async (audio) => {
    const { uri } = audio
    const { soundObject, playbackObject, currentAudio, updateState, audioFiles } = this.context
    const currentAudioIndex = audioFiles.indexOf(audio)

    if (soundObject === null) {
      const playbackObject = new Audio.Sound()
      const status = await play({ playbackObject, uri })
      const newState = {
        currentAudio: audio,
        soundObject: status,
        isPlaying: true,
        playbackObject,
        currentAudioIndex
      }

      return updateState(this.context, newState)
    } else {
      const { isLoaded, isPlaying } = soundObject
      const { id } = currentAudio

      if (isLoaded && id === audio.id) {
        if (isPlaying) {
          const status = await pause(playbackObject)
          const newState = { soundObject: status, isPlaying: false }

          return updateState(this.context, newState)
        } else {
          const status = await resume(playbackObject)
          const newState = { soundObject: status, isPlaying: true }

          return updateState(this.context, newState)
        }
      } else if (id !== audio.id) {
        const status = await next({ playbackObject, uri })
        const newState = {
          currentAudio: audio,
          soundObject: status,
          isPlaying: true,
          currentAudioIndex
        }

        return updateState(this.context, newState)
      }
    }
  }

  rowRenderer = (type, item, index, extendedState) => {
    const { isPlaying, currentAudioIndex } = extendedState
    const { filename, duration, uri } = item
    const { letter, trackname } = getListItemText(filename)
    const time = getListItemTime(duration)
    const activeListItem = currentAudioIndex === index

    return (
      <AudioListItem
        letter={letter}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        trackname={trackname}
        time={time}
        onPress={() => this.onPressHandler(item)}
        onAudioPress={() => this.audioPressHandler(item)}
      />
    )
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying, currentAudioIndex }) => {
          return (
            <>
              <RecyclerListView
                style={styles.view}
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying, currentAudioIndex }}
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
