import React, { Component } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'
import MusicInfo from 'expo-music-info'

import { TrackListItem } from '../components/TrackListItem'
import { color } from '../misc/color'
import { getListItemText, getListItemTime } from '../misc/trackListItemHelpers'
import { PlaylistModal } from '../components/PlaylistModal'
import { play, pause, resume, next } from '../misc/audioController'
import { storeAudioForNextOpening } from '../misc/helper'

const { BG } = color

export class Tracklist extends Component {
  static contextType = AudioContext

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
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

  componentDidMount() {
    this.context.loadPreviousAudio()
  }

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
    const {
      soundObject,
      playbackObject,
      currentAudio,
      updateState,
      audioFiles,
      onPlaybackStatusUpdate
    } = this.context

    const index = audioFiles.indexOf(audio)

    const { artist, title } = await MusicInfo.getMusicInfoAsync(uri, { title: true, artist: true })
    await storeAudioForNextOpening(audio, index, artist, title)

    if (soundObject === null) {
      const playbackObject = new Audio.Sound()
      const status = await play({ playbackObject, uri })
      const newState = {
        currentAudio: audio,
        soundObject: status,
        isPlaying: true,
        playbackObject,
        currentAudioIndex: index
      }

      updateState(this.context, newState)

      const getMetadata = async (uri) => {
        let response = await MusicInfo.getMusicInfoAsync(uri, {
          title: true,
          artist: true
        })
        return response
      }
      const { artist, title } = await getMetadata(uri)

      return playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
      // return await storeAudioForNextOpening(audio, index, artist, title)
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
          currentAudioIndex: index
        }

        updateState(this.context, newState)
        // return await storeAudioForNextOpening(audio, index)
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
      <TrackListItem
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
          // if (!dataProvider._data.length) return null
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
