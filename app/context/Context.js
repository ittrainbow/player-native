import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getTrackNames, next, getAsync, setAsync, initials } from '../helpers'

const { initialPlaylist } = initials

export const Context = React.createContext()

class ContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      audioFiles: null,
      playlist: initialPlaylist,
      playlistNumber: 0,
      isPlaylist: false,
      shuffle: false,
      addToPlaylist: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      layoutProvider: null,
      playbackObject: null,
      soundObject: null,
      currentAudio: null,
      currentAudioIndex: null,
      isPlaying: false,
      totalCount: 0,
      playbackPosition: null,
      playbackDuration: null
    }
  }

  async componentDidMount() {
    const playlist = await getAsync('playlist')
    this.getPermission()
    if (this.state.playbackObject === null) {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true
      })
      const playbackObject = new Audio.Sound()
      this.setState({ ...this.state, playbackObject, playlist })
    }
  }

  loadPreviousAudio = async () => {
    const previousAudio = await getAsync('previousAudio')
    let currentAudio, currentAudioIndex
    if (previousAudio) {
      const { audio, index} = previousAudio
      currentAudio = audio
      currentAudioIndex = index
    } else {
      currentAudio = this.state.audioFiles[0]
      currentAudioIndex = 0
    }
    this.setState({ ...this.state, currentAudio, currentAudioIndex })
  }

  getMetadata = (uri) => {
    const { artist, title } = getTrackNames(uri)

    return { artist, title }
  }

  permissionAlert = () => {
    Alert.alert(
      'Permission needed',
      'File system access is necessary to search through your device media library',
      [
        { text: 'Согласиться', onPress: () => this.getPermission() },
        { text: 'Отменить', onPress: () => this.permissionAlert() }
      ]
    )
  }

  getFiles = async ({ reload }) => {
    const { dataProvider } = this.state
    let tracks = await getAsync('tracks')

    if (tracks === null || tracks.length < 10 || reload) {
      let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })
      const { totalCount } = media

      media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: totalCount
      })
      tracks = [...media.assets].filter((el) => el.duration > 90)
      await setAsync('tracks', tracks)
    }

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows(tracks),
      audioFiles: tracks,
      totalCount: tracks.length
    })
  }

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync()
    const { granted, canAskAgain } = permission
    const notGrantedCanAsk = async () => {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

      if (status === 'denied') canAskAgain && this.permissionAlert()
      if (status === 'granted') this.getFiles({ reload: false })
      if (status === 'denied' && !canAskAgain)
        this.setState({ ...this.state, permissionError: true })
    }

    if (granted) this.getFiles({ reload: false })
    else if (canAskAgain) notGrantedCanAsk()
    else this.setState({ ...this.state, permissionError: true })
  }

  updateState = (prevState, newState = {}) => {
    this.setState({
      ...prevState,
      ...newState
    })
  }

  getNextAudio = ({ value }) => {
    const counter = value === 'prev' ? -1 : 1
    const { playlist, playlistNumber, isPlaylist, currentAudio, audioFiles, shuffle } = this.state
    const list = isPlaylist ? playlist[playlistNumber].tracks : audioFiles
    const numPlaylist = currentAudio
      ? list.map((track) => track.id).indexOf(currentAudio.id) + counter
      : 0
    const num = numPlaylist === list.length ? 0 : numPlaylist
    const rand = Math.floor(Math.random() * (isPlaylist ? list.length : audioFiles.length))

    const response = list[shuffle ? rand : num]
    return response
  }

  onPlaybackStatusUpdate = async (playbackStatus) => {
    const { positionMillis, durationMillis, isLoaded, isPlaying, didJustFinish } = playbackStatus
    const { updateState, currentAudioIndex, playbackObject, totalCount } = this.state
    const { context } = this
    const newState = {
      playbackPosition: positionMillis,
      playbackDuration: durationMillis
    }

    isLoaded && isPlaying && updateState(context, newState)

    if (didJustFinish) {
      const maxReached = currentAudioIndex + 1 >= totalCount
      const index = maxReached ? 0 : currentAudioIndex + 1
      const audio = this.getNextAudio(index)
      const { uri } = audio
      const status = await next({ playbackObject, uri, audio, index })
      const newState = {
        currentAudio: audio,
        soundObject: status,
        currentAudioIndex: index
      }
      return updateState(this, newState)
    }
  }

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObject,
      soundObject,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      totalCount,
      playbackPosition,
      playbackDuration,
      playlist,
      isPlaylist,
      playlistNumber,
      addToPlaylist,
      shuffle
    } = this.state
    if (permissionError)
      return (
        <View style={styles.audioProviderError}>
          <Text style={styles.audioProviderErrorText}>
            Выдайте разрешение на доступ к файловой системе, может потребоваться переустановка
            приложения
          </Text>
        </View>
      )
    return (
      <Context.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObject,
          soundObject,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalCount,
          playbackPosition,
          playbackDuration,
          playlist,
          isPlaylist,
          playlistNumber,
          addToPlaylist,
          shuffle,
          getNextAudio: this.getNextAudio,
          loadPreviousAudio: this.loadPreviousAudio,
          updateState: this.updateState,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
          getMetadata: this.getMetadata,
          getFiles: this.getFiles
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

const styles = StyleSheet.create({})

export default ContextProvider
