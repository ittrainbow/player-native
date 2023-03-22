import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getTrackNames } from '../misc/getTrackNames'
import { next } from '../misc/audioController'

export const AudioContext = React.createContext()

class AudioProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      audioFiles: [],
      playlist: [],
      addToPlaylist: null,
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObject: null,
      soundObject: null,
      currentAudio: null,
      currentArtist: '',
      currentTitle: '',
      currentAudioIndex: null,
      isPlaying: false,
      totalCount: 0,
      playbackPosition: null,
      playbackDuration: null
    }

    this.track = {
      currentArtist: '',
      currentTitle: ''
    }
  }

  componentDidMount() {
    this.getPermission()
    if (this.state.playbackObject === null) {
      const playbackObject = new Audio.Sound()
      this.setState({ ...this.state, playbackObject })
    }
  }

  getMetadata = (uri) => {
    const { artist, title } = getTrackNames(uri)
    this.track = { currentArtist: artist, currentTitle: title }

    return { artist, title }
  }

  logMetadata = () => {
  }

  permissionAlert = () => {
    Alert.alert(
      'Требуется разрешение',
      'Для доступа к аудио-файлам приложению требуется доступ к файловой системе',
      [
        {
          text: 'Согласиться',
          onPress: () => this.getPermission()
        },
        {
          text: 'Отменить',
          onPress: () => this.permissionAlert()
        }
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

    const data = [...audioFiles, ...media.assets].filter((el) =>
      el.uri.includes('/0/Music/mp3') ? el : null
    )

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows(data),
      audioFiles: data,
      totalCount: data.length
    })
  }

  loadPreviousAudio = async () => {
    const previousAudio = await AsyncStorage.getItem('previousAudio')
    const { audio, index, artist, title } = previousAudio ? JSON.parse(previousAudio) : null
    const { audioFiles } = this.state

    const currentAudio = previousAudio ? audio : audioFiles[0]
    const currentAudioIndex = previousAudio ? index : 0

    this.setState({ ...this.state, currentAudio, currentAudioIndex })
    this.track = { currentArtist: artist, currentTitle: title }
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
    !granted && canAskAgain && notGrantedCanAsk
  }

  updateState = (prevState, newState = {}) => {
    this.setState({
      ...prevState,
      ...newState
    })
  }

  onPlaybackStatusUpdate = async (playbackStatus) => {
    const { positionMillis, durationMillis, isLoaded, isPlaying, didJustFinish } = playbackStatus
    const { updateState, currentAudioIndex, audioFiles, playbackObject, totalCount } = this.state
    const { currentArtist, currentTitle } = this.track
    const newState = {
      playbackPosition: positionMillis,
      playbackDuration: durationMillis
    }

    isLoaded && isPlaying && updateState(this, newState)

    if (didJustFinish) {
      const maxReached = currentAudioIndex + 1 >= totalCount
      const index = maxReached ? 0 : currentAudioIndex + 1
      const audio = audioFiles[index]
      const { uri } = audio
      const artist = currentArtist
      const title = currentTitle
      const status = await next({ playbackObject, uri, audio, index, artist, title })
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
      addToPlaylist,
      currentArtist,
      currentTitle
    } = this.state
    // const { currentArtist, currentTitle } = this.track
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
      <AudioContext.Provider
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
          currentArtist,
          currentTitle,
          playlist,
          addToPlaylist,
          track: this.track,
          loadPreviousAudio: this.loadPreviousAudio,
          updateState: this.updateState,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
          getMetadata: this.getMetadata
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  audioProviderError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioProviderErrorText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'red',
    padding: 15
  }
})

export default AudioProvider
