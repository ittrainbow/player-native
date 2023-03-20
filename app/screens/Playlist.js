import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import AddPlaylistModal from '../components/AddPlaylistModal'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc/color'
const { CREME, CREME_DARK } = color

const { width } = Dimensions.get('window')

export const Playlist = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const context = useContext(AudioContext)
  const { playlist, addToPlaylist, updateState } = context

  const onCloseAddPlaylistModal = () => {
    setModalVisible(false)
  }

  useEffect(() => {
    if (!playlist.length) {
      renderPlaylist()
    }
  }, [])

  const createPlaylist = async (playlistName) => {
    const response = await AsyncStorage.getItem('playlist')

    if (response !== null) {
      console.log(98, 'response not null')
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
      console.log(99, 'response === null')
    }
    setModalVisible(false)
  }

  const renderPlaylist = async () => {
    const response = await AsyncStorage.getItem('playlist')
    console.log(100, JSON.parse(response))
    if (response === null) {
      console.log(101, 'result === null')
      const defaultPlaylist = {
        id: Date.now(),
        title: 'Favorites',
        tracks: []
      }
      console.log(102, defaultPlaylist)

      const updatedPlaylist = [...playlist, defaultPlaylist]
      console.log(103, updatedPlaylist)
      const newState = { playlist: [...updatedPlaylist] }
      console.log(104, newState)
      updateState(context, newState)
      return await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
    }
    const newState = { playlist: JSON.parse(response) }
    return updateState(context, newState)
  }

  const renderPlaylistItem = ({ item }) => {
    return <Text>{item.title}</Text>
  }

  const logger = () => {
    console.log(playlist)
  }

  const clearPlaylists = async () => {
    await AsyncStorage.removeItem('playlist')
    const response = await AsyncStorage.getItem('playlist')
    console.log(response)
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
      {playlist.map((item) => {
        const num = item.tracks.length
        return (
          <View style={styles.banner} key={item.id}>
            <Text style={styles.bannerLeft}>{item.title}</Text>
            <Text style={styles.bannerRight}>{num} {num === 1 ? 'song' : 'songs'}</Text>
          </View>
        )
      })}
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
    gap: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    gap: 8
  },
  banner: {
    padding: 10,
    height: 50,
    flexDirection: 'row',
    backgroundColor: CREME_DARK,
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
    gap: 8
  },
  add: {
    padding: 10,
    height: 50,
    backgroundColor: CREME_DARK,
    borderRadius: 10,
    alignItems: 'center',
    width: width / 3 - 14
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
