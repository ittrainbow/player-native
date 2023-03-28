import React, { useState, useEffect } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'
// import AsyncStorage from '@react-native-async-storage/async-storage'

import { getTrackNames, next, getAsync, setAsync, initials } from '../helpers'

const { initialPlaylist } = initials

export const Context = React.createContext()

export const ContextProvider = ({ children }) => {
  const [audioFiles, setAudioFiles] = useState(null)
  const [playlist, setPlaylist] = useState(initialPlaylist)
  const [isLoading, setIsLoading] = useState(false)
  const [playlistNumber, setPlaylistNumber] = useState(0)
  const [isPlaylist, setIsPlaylist] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [addToPlaylist, setAddToPlaylist] = useState(null)
  const [permissionError, setPermissionError] = useState(false)
  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => r1 !== r2))
  const [layoutProvider, setLayoutProvider] = useState(null)
  const [playbackObject, setPlaybackObject] = useState(null)
  const [soundObject, setSoundObject] = useState(null)
  const [currentAudio, setCurrentAudio] = useState(null)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [playbackPosition, setPlaybackPosition] = useState(null)
  const [playbackDuration, setPlaybackDuration] = useState(null)

  // constructor(props) {
  //   super(props)

  //   this1.state = {
  //     audioFiles: null,
  //     playlist: initialPlaylist,
  //     isLoading: false,
  //     playlistNumber: 0,
  //     isPlaylist: false,
  //     shuffle: false,
  //     addToPlaylist: null,
  //     permissionError: false,
  //     dataProvider: new DataProvider((r1, r2) => r1 !== r2),
  //     layoutProvider: null,
  //     playbackObject: null,
  //     soundObject: null,
  //     currentAudio: null,
  //     currentAudioIndex: null,
  //     isPlaying: false,
  //     totalCount: 0,
  //     playbackPosition: null,
  //     playbackDuration: null
  //   }
  // }

  useEffect(() => {
    getPermission()
  }, [])

  useEffect(() => {
    const getPlaylistAndObject = async () => {
      if (!playbackObject) {
        const playlist = await getAsync('playlist')
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true
        })
        const playbackObject = new Audio.Sound()
        setPlaylist(playlist)
        setPlaybackObject(playbackObject)
      }
    }
    getPlaylistAndObject()
  }, [])

  // async componentDidMount() {
  //   const playlist = await getAsync('playlist')
  //   this1.getPermission()
  //   if (this1.state.playbackObject === null) {
  //     await Audio.setAudioModeAsync({
  //       staysActiveInBackground: true
  //     })
  //     const playbackObject = new Audio.Sound()
  //     this1.setState({ ...this1.state, playbackObject, playlist })
  //   }
  // }

  const loadPreviousAudio = async () => {
    const previousAudio = await getAsync('previousAudio')
    let currentAudio, currentAudioIndex
    if (previousAudio) {
      // console.log(71, previousAudio)
      const { audio } = previousAudio
      currentAudio = audio
      currentAudioIndex = audioFiles.map((audio) => audio.id).indexOf(audio.id)
      setCurrentAudio(audio)
      setCurrentAudioIndex(audioFiles.map((audio) => audio.id).indexOf(audio.id) || 0)
      // console.log(72, currentAudioIndex)
    } else {
      setCurrentAudio(audioFiles[0])
      setCurrentAudioIndex(0)
    }
    // this1.setState({ ...this1.state, currentAudio, currentAudioIndex })
    // setCurrentAudio(currentAudio)
    // setCurrentAudioIndex(currentAudioIndex)
  }

  const getMetadata = (uri) => {
    const { artist, title } = getTrackNames(uri)

    return { artist, title }
  }

  const permissionAlert = () => {
    Alert.alert(
      'Permission needed',
      'File system access is necessary to search through your device media library',
      [
        { text: 'Согласиться', onPress: () => getPermission() },
        { text: 'Отменить', onPress: () => permissionAlert() }
      ]
    )
  }

  const getFiles = async ({ reload }) => {
    // this1.setState({ ...this1.state, isLoading: true })
    setIsLoading(true)
    // const { dataProvider } = this1.state
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

    if (reload) {
      await setAsync('playlist', initialPlaylist)
      // this1.setState({ ...this1.state, playlist: initialPlaylist })
      setPlaylist(initialPlaylist)
    }

    // this1.setState({
    //   ...this1.state,
    //   dataProvider: dataProvider.cloneWithRows(tracks),
    //   audioFiles: tracks,
    //   totalCount: tracks.length,
    //   isLoading: false
    // })
    setDataProvider(dataProvider.cloneWithRows(tracks))
    setAudioFiles(tracks)
    setTotalCount(tracks.length)
    setIsLoading(false)
  }

  const getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync()
    const { granted, canAskAgain } = permission
    const notGrantedCanAsk = async () => {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

      if (status === 'denied' && canAskAgain) permissionAlert()
      if (status === 'granted') getFiles({ reload: false })
      if (status === 'denied' && !canAskAgain) setPermissionError(true)
      // this1.setState({ ...this1.state, permissionError: true })
    }

    if (granted) getFiles({ reload: false })
    else if (canAskAgain) notGrantedCanAsk()
    // else this1.setState({ ...this1.state, permissionError: true })
    else setPermissionError(true)
  }

  // update1State = (prevState, newState = {}) => {
  //   this1.setState({
  //     ...prevState,
  //     ...newState
  //   })
  // }

  const getNextAudio = ({ value }) => {
    // console.log(50, value)
    const counter = value === 'prev' ? -1 : 1
    // console.log(51, counter)
    // const { playlist, playlistNumber, isPlaylist, currentAudio, audioFiles, shuffle } = this1.state
    const list = isPlaylist ? playlist[playlistNumber].tracks : audioFiles
    // console.log(52, list)
    const numPlaylist = currentAudio
      ? list.map((track) => track.id).indexOf(currentAudio.id) + counter
      : 0
    // console.log(53, numPlaylist)
    const num = numPlaylist === list.length ? 0 : numPlaylist
    // console.log(54, num)
    const rand = Math.floor(Math.random() * (isPlaylist ? list.length : audioFiles.length))
    // console.log(55, rand)
    const response = list[shuffle ? rand : num]
    // console.log(56, response)
    return response
  }

  const onPlaybackStatusUpdate = async (playbackStatus) => {
    const { positionMillis, durationMillis, isLoaded, isPlaying, didJustFinish } = playbackStatus
    // const {
    //   update1State,
    //   currentAudioIndex,
    //   playbackObject,
    //   totalCount
    // } = this1.state
    // const { context } = this
    // const newState = {
    //   playbackPosition: positionMillis,
    //   playbackDuration: durationMillis
    // }
    // isLoaded && isPlaying && update1State(context, newState)

    if (isLoaded && isPlaying) {
      setPlaybackPosition(positionMillis)
      setPlaybackDuration(durationMillis)
    }

    if (didJustFinish) {
      const maxReached = currentAudioIndex + 1 >= totalCount
      const index = maxReached ? 0 : currentAudioIndex + 1
      const audio = getNextAudio(index)
      const { uri } = audio
      const status = await next({ playbackObject, uri, audio, index })
      // const newState = {
      //   currentAudio: audio,
      //   soundObject: status,
      //   currentAudioIndex: index
      // }
      // return update1State(this, newState)
      setCurrentAudio(audio)
      setSoundObject(status)
      setCurrentAudioIndex(index)
    }
  }

  // render() {
  // const {
  //   audioFiles,
  //   dataProvider,
  //   permissionError,
  //   playbackObject,
  //   soundObject,
  //   currentAudio,
  //   isPlaying,
  //   currentAudioIndex,
  //   totalCount,
  //   playbackPosition,
  //   playbackDuration,
  //   playlist,
  //   isPlaylist,
  //   playlistNumber,
  //   addToPlaylist,
  //   shuffle,
  //   isLoading
  // } = this1.state
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
        setAudioFiles,
        playlist,
        setPlaylist,
        playlistNumber,
        setPlaylistNumber,
        isLoading,
        setIsLoading,
        isPlaylist,
        setIsPlaylist,
        shuffle,
        setShuffle,
        addToPlaylist,
        setAddToPlaylist,
        permissionError,
        setPermissionError,
        dataProvider,
        setDataProvider,
        layoutProvider,
        setLayoutProvider,
        playbackObject,
        setPlaybackObject,
        soundObject,
        setSoundObject,
        currentAudio,
        setCurrentAudio,
        currentAudioIndex,
        setCurrentAudioIndex,
        isPlaying,
        setIsPlaying,
        totalCount,
        setTotalCount,
        playbackPosition,
        setPlaybackPosition,
        playbackDuration,
        setPlaybackDuration,
        getNextAudio,
        loadPreviousAudio,
        onPlaybackStatusUpdate,
        getMetadata,
        getFiles
      }}
    >
      {children}
    </Context.Provider>
  )
}
// }

const styles = StyleSheet.create({})

export default ContextProvider
