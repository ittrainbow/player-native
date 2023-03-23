import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'

import AddPlaylistModal from '../components/AddPlaylistModal'
import ExistsModal from '../components/ExistsModal'
import DetailedPlaylist from '../components/DetailedPlaylist'
import DropdownMenu from '../components/DropdownMenu'
import PlaylistItem from '../components/PlaylistItem'
import TrackListItem from '../components/TrackListItem'
import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc/color'
const { CREME, CREME_DARK } = color

const { width } = Dimensions.get('window')

const initialPlaylist = (title = '', tracks = []) => {
  return {
    id: Date.now(),
    title,
    tracks
  }
}

export const Playlist = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [existsVisible, setExistsVisible] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(initialPlaylist())
  const context = useContext(AudioContext)
  const { playlist, addToPlaylist, updateState } = context

  useEffect(() => {
    if (!playlist.length) {
      renderPlaylist()
    }
  }, [])

  useEffect(() => {
    if (playlist.length) setSelectedPlaylist(playlist[0])
  }, [playlist])

  const onCloseAddPlaylistModal = () => {
    setModalVisible(false)
  }

  const onCloseExistsModal = () => {
    setExistsVisible(false)
  }

  const createPlaylist = async (playlistName) => {
    const response = await AsyncStorage.getItem('playlist')

    if (response !== null) {
      const tracks = []
      const newList = initialPlaylist(playlistName, tracks)

      addToPlaylist && tracks.push(addToPlaylist)

      const updatedPlaylist = [...playlist, newList]
      const newState = {
        addToPlaylist: null,
        playlist: updatedPlaylist
      }
      updateState(context, newState)
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
    }
    setModalVisible(false)
  }

  const renderPlaylist = async () => {
    const response = await AsyncStorage.getItem('playlist')
    if (response === null) {
      const defaultPlaylist = initialPlaylist('Favorites', [])

      const updatedPlaylist = [...playlist, defaultPlaylist]
      const newState = { playlist: [...updatedPlaylist] }
      updateState(context, newState)
      return await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
    }
    const newState = { playlist: JSON.parse(response) }
    return updateState(context, newState)
  }

  const logger = () => {
    // console.log(playlist)
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

    setSelectedPlaylist(playlist)
  }

  const onSwipe = (gestureName) => {
    const { SWIPE_RIGHT } = swipeDirections
    switch (gestureName) {
      case SWIPE_RIGHT:
        navigation.navigate('Player')
        break
      default:
        break
    }
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  }

  const onDetailedPressHandler = () => {}

  return (
    <GestureRecognizer onSwipe={(direction, state) => onSwipe(direction, state)} config={config}>
      <View style={styles.container}>
        <DropdownMenu list={playlist} onPress={onBannerPress} />
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
          const { id } = item
          return addToPlaylist ? (
            <PlaylistItem key={id} item={item} onPress={onBannerPress} />
          ) : null
        })}

        {addToPlaylist ? null : <DetailedPlaylist playlist={selectedPlaylist} />}

        <ExistsModal
          visible={existsVisible}
          onClose={onCloseExistsModal}
          onPress={onDetailedPressHandler}
        />
        <AddPlaylistModal
          visible={modalVisible}
          onClose={onCloseAddPlaylistModal}
          onSubmit={createPlaylist}
        />
      </View>
    </GestureRecognizer>
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
