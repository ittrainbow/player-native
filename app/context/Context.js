import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'
import { Audio } from 'expo-av'

import { getTrackNames, getAsync, setAsync, next, initials } from '../helpers'

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

  useEffect(() => {
    getPermission()
  }, [])

  useEffect(() => {
    const getPlaylistAndObject = async () => {
      const isPlaylist = await getAsync('isPlaylist')
      setIsPlayingPlaylist(isPlaylist)

      if (!playbackObject) {
        const playlist = await getAsync('playlist')
        await Audio.setAudioModeAsync({ staysActiveInBackground: true })
        const playbackObject = new Audio.Sound()
        setPlaylist(playlist)
        setPlaybackObject(playbackObject)
      }
    }
    getPlaylistAndObject()
  }, [])

  useEffect(() => {
    const getNext = async () => {
      const maxReached = currentAudioIndex + 1 >= totalCount
      const index = maxReached ? 0 : currentAudioIndex + 1
      const audio = getNextAudio({ value: 'next' })
      const status = await next({ playbackObject, audio, index })

      setCurrentAudio(audio)
      setSoundObject(status)
      setCurrentAudioIndex(index)
    }
    if (playbackPosition && playbackDuration - playbackPosition < 500) getNext()
  }, [playbackDuration, playbackPosition])

  useEffect(() => {
    if (audioFiles && isLoading) {
      setIsLoading(false)
      loadPreviousAudio()
    }
  }, [audioFiles])

  const setIsPlayingPlaylist = (value) => {
    // if (value && value !== isPlaylist) { // 02.05 - не помню на кой бес нужно это условие
    setIsPlaylist(value)
    setAsync('isPlaylist', value)
    // }
  }

  const loadPreviousAudio = async () => {
    const previousAudio = await getAsync('previousAudio')

    if (previousAudio) {
      const { audio } = previousAudio
      const currentAudioIndex = audioFiles.map((audio) => audio.id).indexOf(audio.id) || 0
      setCurrentAudio(audio)
      setCurrentAudioIndex(currentAudioIndex)
    } else {
      setCurrentAudio(audioFiles[0])
      setCurrentAudioIndex(0)
    }
  }

  const getMetadata = (filename) => {
    const { artist, title } = getTrackNames(filename)
    return { artist, title }
  }

  const permissionAlert = () => {
    Alert.alert(
      'Permission needed',
      'File system access is necessary to search through your device media library',
      [
        { text: 'OK', onPress: () => getPermission() },
        { text: 'Cancel', onPress: () => permissionAlert() }
      ]
    )
  }

  const getFiles = async ({ reload }) => {
    setIsLoading(true)

    let tracks = await getAsync('tracks')

    if (tracks === null || tracks.length < 10 || reload) {
      let media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' })
      const { totalCount } = media
      media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: totalCount })
      tracks = [...media.assets].filter((el) => el.duration > 90)
      await setAsync('tracks', tracks)
    }

    if (reload) {
      await setAsync('playlist', initialPlaylist)
      setPlaylist(initialPlaylist)
    }

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

      status === 'granted'
        ? getFiles({ reload: false })
        : canAskAgain
        ? permissionAlert()
        : setPermissionError(true)
    }

    if (granted) getFiles({ reload: false })
    else if (canAskAgain) notGrantedCanAsk()
    else setPermissionError(true)
  }

  const getNextAudio = ({ value }) => {
    const counter = value === 'prev' ? -1 : 1
    const list = isPlaylist ? playlist[playlistNumber].tracks : audioFiles
    const numPlaylist = currentAudio
      ? list.map((track) => track.id).indexOf(currentAudio.id) + counter
      : 0
    const num = numPlaylist === list.length ? 0 : numPlaylist
    const rand = Math.floor(Math.random() * (isPlaylist ? list.length : audioFiles.length))
    const response = list[shuffle ? rand : num]
    return response
  }

  const onPlaybackStatusUpdate = async (playbackStatus) => {
    const { positionMillis, durationMillis, isLoaded, isPlaying } = playbackStatus

    if (isLoaded && isPlaying) {
      setPlaybackPosition(positionMillis)
      setPlaybackDuration(durationMillis)
    }
  }

  if (permissionError)
    return (
      <View style={styles.audioProviderError}>
        <Text style={styles.audioProviderErrorText}>Grant access to file storage</Text>
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
        setIsPlayingPlaylist,
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

const styles = StyleSheet.create({})

export default ContextProvider
