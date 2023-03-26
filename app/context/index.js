import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'

import { getTrackNames, next, getAsync, initials } from '../helpers'

const { initialPlaylist } = initials

export const Context = React.createContext()

class ContextProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      audioFiles: [],
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

  getMetadata = (uri) => {
    const { artist, title } = getTrackNames(uri)

    return { artist, title }
  }

  logMetadata = () => {}

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

  getFiles = async () => {
    const { dataProvider, audioFiles } = this.state
    let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })
    const { totalCount } = media

    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: totalCount
    })

    this.setState({ ...this.state, totalCount })

    const data = [...audioFiles, ...media.assets].filter((el) => el.duration > 90)

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows(data),
      audioFiles: data,
      totalCount: data.length
    })
  }

  loadPreviousAudio = async () => {
    const previousAudio = await getAsync('previousAudio')
    const { audio, index } = previousAudio ? previousAudio : null
    const { audioFiles } = this.state

    const currentAudio = previousAudio ? audio : audioFiles[0]
    const currentAudioIndex = previousAudio ? index : 0

    this.setState({ ...this.state, currentAudio, currentAudioIndex })
  }

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync()
    const { granted, canAskAgain } = permission
    const notGrantedCanAsk = async () => {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

      status === 'denied' && canAskAgain && this.permissionAlert()
      status === 'granted' && this.getFiles()
      status === 'denied' && !canAskAgain && this.setState({ ...this.state, permissionError: true })
    }

    granted && this.getFiles()
    !granted && !canAskAgain && this.setState({ ...this.state, permissionError: true })
    !granted && canAskAgain && notGrantedCanAsk()
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
    const numPlaylist = list.map((track) => track.id).indexOf(currentAudio.id) + counter
    const num = numPlaylist === list.length ? 0 : numPlaylist
    const rand = Math.floor(Math.random() * (isPlaylist ? list.length : audioFiles.length))

    return list[shuffle ? rand : num]
  }

  onPlaybackStatusUpdate = async (playbackStatus) => {
    const { positionMillis, durationMillis, isLoaded, isPlaying, didJustFinish } = playbackStatus
    const { updateState, currentAudioIndex, playbackObject, totalCount } = this.state
    const newState = {
      playbackPosition: positionMillis,
      playbackDuration: durationMillis
    }

    isLoaded && isPlaying && updateState(this, newState)

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
          getMetadata: this.getMetadata
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}

const styles = StyleSheet.create({
})

export default ContextProvider
