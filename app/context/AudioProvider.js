import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Audio } from 'expo-av'
import RNMusicMetadata from 'react-native-music-metadata'

export const AudioContext = React.createContext()

class AudioProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObject: null,
      soundObject: null,
      currentAudio: {},
      currentTrackname: null,
      currentAudioIndex: null,
      isPlaying: false,
      totalCount: 0,
      playbackPosition: null,
      playbackDuration: null
    }
  }

  componentDidMount() {
    this.getPermission()
    if (this.state.playbackObject === null) {
      const playbackObject = new Audio.Sound()
      this.setState({ ...this.state, playbackObject })
    }
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

    const data = [...audioFiles, ...media.assets]
    const { uri } = data[0]

    console.log(1, uri)
    
    RNMusicMetadata.getMetadata(['uri'])
      .try((tracks) => {
        tracks.forEach((track) => {
          console.log(`${track.title} by ${track.artist}`)
        })
      })
      .catch((err) => {
        console.error(err)
      })

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows(data),
      audioFiles: data
    })
  }

  loadPreviousAudio = async () => {
    const { audioFiles } = this.state
    const previousAudio = await AsyncStorage.getItem('previousAudio')
    const { audio, index } = previousAudio ? JSON.parse(previousAudio) : null

    const currentAudio = previousAudio ? audio : audioFiles[0]
    const currentAudioIndex = previousAudio ? index : 0

    this.setState({ ...this.state, currentAudio, currentAudioIndex })
  }

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync()
    const { granted, canAskAgain } = permission

    if (granted) this.getFiles()
    if (!canAskAgain && !granted) this.setState({ ...this.state, permissionError: true })
    if (!granted && canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

      if (status === 'denied' && canAskAgain) this.permissionAlert()
      if (status === 'granted') this.getFiles()
      if (status === 'denied' && !canAskAgain)
        this.setState({ ...this.state, permissionError: true })
    }
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
    const newState = {
      playbackPosition: positionMillis,
      playbackDuration: durationMillis
    }

    isLoaded && isPlaying && updateState(this, newState)

    if (didJustFinish) {
      console.log('did just finished')
      const maxReached = currentAudioIndex + 1 >= totalCount
      const index = maxReached ? 0 : currentAudioIndex + 1
      const audio = audioFiles[index]
      const { uri } = audio
      const status = await next({ playbackObject, uri })
      const newState = {
        currentAudio: audio,
        soundObject: status,
        currentAudioIndex: index
      }
      updateState(this, newState)
      return await storeAudioForNextOpening(audio, index)
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
      playbackDuration
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
          loadPreviousAudio: this.loadPreviousAudio,
          updateState: this.updateState,
          onPlaybackStatusUpdate: this.onPlaybackStatusUpdate
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
