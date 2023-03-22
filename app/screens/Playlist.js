import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'

import AddPlaylistModal from '../components/AddPlaylistModal'
import ExistsModal from '../components/ExistsModal'
import { PlaylistItem } from '../components/PlaylistItem'
import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc/color'
const { CREME, CREME_DARK } = color

const { width } = Dimensions.get('window')

export const Playlist = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [existsVisible, setExistsVisible] = useState(false)
  const context = useContext(AudioContext)
  const { playlist, addToPlaylist, updateState } = context

  const onCloseAddPlaylistModal = () => {
    setModalVisible(false)
  }

  const onCloseExistsModal = () => {
    setExistsVisible(false)
  }

  useEffect(() => {
    if (!playlist.length) {
      renderPlaylist()
    }
  }, [])

  const createPlaylist = async (playlistName) => {
    const response = await AsyncStorage.getItem('playlist')

    if (response !== null) {
      const tracks = []
      const newList = {
        id: Date.now(),
        title: playlistName,
        tracks
      }

      addToPlaylist && tracks.push(addToPlaylist)

      const updatedPlaylist = [...playlist, newList]
      const newState = {
        addToPlaylist: null,
        playlist: updatedPlaylist
      }
      updateState(context, newState)
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
    } else {
    }
    setModalVisible(false)
  }

  const renderPlaylist = async () => {
    const response = await AsyncStorage.getItem('playlist')
    if (response === null) {
      const defaultPlaylist = {
        id: Date.now(),
        title: 'Favorites',
        tracks: []
      }

      const updatedPlaylist = [...playlist, defaultPlaylist]
      const newState = { playlist: [...updatedPlaylist] }
      updateState(context, newState)
      return await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
    }
    const newState = { playlist: JSON.parse(response) }
    return updateState(context, newState)
  }

  const renderPlaylistItem = (item) => {
    const num = item.tracks.length
    return (
      <TouchableOpacity style={styles.banner} key={item.id} onPress={() => onBannerPress(item)}>
        <Text style={styles.bannerLeft}>{item.title}</Text>
        <Text style={styles.bannerRight}>
          {num} {num === 1 ? 'song' : 'songs'}
        </Text>
      </TouchableOpacity>
    )
  }

  const logger = () => {
    console.log(playlist)
  }

  const clearPlaylists = async () => {
    await AsyncStorage.removeItem('playlist')
  }

  const onBannerPress = async (playlist) => {
    if (addToPlaylist) {
      const response = await AsyncStorage.getItem('playlist')
      let updatedList = []
      let alreadyInPlaylist = false

      if (response !== null) {
        updatedList = JSON.parse(response).filter((list) => {
          if (list.id === playlist.id) {
            alreadyInPlaylist = list.tracks.map((track) => track.id).includes(addToPlaylist.id)
            if (alreadyInPlaylist) {
              setExistsVisible(true)
              return
            }
            list.tracks = [...list.tracks, addToPlaylist]
          }

          return list
        })
      }

      if (alreadyInPlaylist) return updateState(context, { addToPlaylist: null })
      updateState(context, { addToPlaylist: null, playlist: updatedList })
      AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
    }

    console.log('open list')
  }

  return (
    <View style={styles.container}>
      <View style={styles.addDelContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.add}>
          <Text style={styles.bannerAdd}>New Playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logger} style={styles.add}>
          <Text style={styles.bannerLog}>Log</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearPlaylists} style={styles.add}>
          <Text style={styles.bannerDel}>Delete All</Text>
        </TouchableOpacity>
      </View>
      {/* {playlist.map((item) => renderPlaylistItem(item))} */}
      {playlist.map((item) => (
        <PlaylistItem key={item.id} item={item} onPress={onBannerPress} />
      ))}
      <ExistsModal visible={existsVisible} onClose={onCloseExistsModal} />
      <AddPlaylistModal
        visible={modalVisible}
        onClose={onCloseAddPlaylistModal}
        onSubmit={createPlaylist}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    fledDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    flexDirection: 'row'
  },
  banner: {
    padding: 10,
    height: 50,
    flexDirection: 'row',
    backgroundColor: CREME_DARK,
    margin: 5,
    borderRadius: 10,
    width: width - 25
  },
  bannerLeft: {
    padding: 3,
    flexGrow: 1,
    fontSize: 16
  },
  bannerRight: {
    opacity: 0.25,
    padding: 3,
    fontSize: 16
  },
  addDelContainer: {
    flexDirection: 'row',
    gap: 10,
    width: width - 25,
    margin: 5
  },
  add: {
    padding: 10,
    height: 50,
    backgroundColor: CREME_DARK,
    borderRadius: 10,
    alignItems: 'center',
    width: width / 3 - 15
  },
  bannerDel: {
    fontSize: 16,
    padding: 3
  },
  bannerAdd: {
    fontSize: 16,
    padding: 3
  },
  bannerLog: {
    fontSize: 16,
    padding: 3
  },
  listElement: {
    padding: 5,
    backgroundColor: CREME
  }
})
