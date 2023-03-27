import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { RecyclerListView } from 'recyclerlistview'
import { useIsFocused } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import { TracklistItem, PlaylistItem } from '../components'
import { Context } from '../context/Context'
import { CreatePlaylistModal, ExistsInPlaylistModal, DeleteFromPlaylistModal } from '../modals'
import { playpause, getLayoutProvider, getColors, getAsync, setAsync } from '../helpers'
import ChoosePlaylistModal from '../modals/ChoosePlaylistModal'
const { CREME, CREME_DARK } = getColors

export const initialPlaylist = (title = '', tracks = []) => {
  return { id: Date.now(), title, tracks }
}

export const Playlists = () => {
  const [createPlaylistModalVisible, setCreatePlaylistModalVisible] = useState(false)
  const [existsInPlaylistModalVisible, setExistsInPlaylistModalVisible] = useState(false)
  const [deleteFromPlaylistModalVisible, setDeleteFromPlaylistModalVisible] = useState(false)
  const [choosePlaylistModalVisible, setChoosePlaylistModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const context = useContext(Context)
  const {
    playlist,
    addToPlaylist,
    updateState,
    playlistNumber,
    dataProvider,
    isPlaying,
    currentAudio,
    getFiles
  } = context
  const focused = useIsFocused()
  const layoutProvider = getLayoutProvider()

  useEffect(() => {
    !playlist.length && renderDefaultPlaylist()
  }, [])

  const createPlaylistHandler = async (playlistName) => {
    const tracks = addToPlaylist ? [addToPlaylist] : []
    const playlistNumber = playlist.length
    const updatedPlaylist = [...playlist, initialPlaylist(playlistName, tracks)]
    const newState = { addToPlaylist: null, playlist: updatedPlaylist, playlistNumber }
    updateState(context, newState)
    await setAsync('playlist', updatedPlaylist)
    return setCreatePlaylistModalVisible(false)
  }

  const onCloseDeleteFromPlaylistModal = () => {
    setDeleteFromPlaylistModalVisible(false)
    return setCurrentItem({})
  }

  const onDotsPressHandler = (item) => {
    setDeleteFromPlaylistModalVisible(true)
    return setCurrentItem(item)
  }

  const deletePlaylist = async () => {
    const playlist = await getAsync('playlist')
    playlist.splice(playlistNumber, 1)
    await setAsync('playlist', playlist)
    const newState = {
      playlist,
      playlistNumber: 0
    }
    return updateState(context, newState)
  }

  const onDeletePlaylistHandler = () => {
    playlistNumber === 0
      ? Alert.alert('Favorites playlist is undeletable')
      : Alert.alert('Delete playlist?', 'This operation cannot be undone', [
          { text: 'Yes', onPress: () => deletePlaylist() },
          { text: 'No', style: 'cancel' }
        ])
  }

  const deleteFromPlaylistHandler = async () => {
    const { id } = currentItem
    const newTracks = [...playlist[playlistNumber].tracks].filter((track) => track.id !== id)
    const newPlaylist = [...playlist]
    newPlaylist[playlistNumber].tracks = newTracks
    updateState(context, { playlist: newPlaylist })
    setDeleteFromPlaylistModalVisible(false)
    return await setAsync('playlist', newPlaylist)
  }

  const renderDefaultPlaylist = async () => {
    const response = await getAsync('playlist')
    if (response === null) {
      const defaultPlaylist = initialPlaylist('Favorites', [])

      const updatedPlaylist = [...playlist, defaultPlaylist]
      const newState = { playlist: [...updatedPlaylist] }
      updateState(context, newState)
      return await setAsync('playlist', updatedPlaylist)
    }
    const newState = { playlist: JSON.parse(response) }
    return updateState(context, newState)
  }

  const onBannerPress = async (playlist) => {
    const { id: modifiedPlaylistID } = playlist
    const playlistNumber = context.playlist.map((list) => list.id).indexOf(modifiedPlaylistID)
    if (addToPlaylist) {
      const response = await getAsync('playlist')
      let updatedList = []
      let alreadyInPlaylist = false

      if (response !== null) {
        updatedList = response.filter((list) => {
          if (list.id === playlist.id) {
            alreadyInPlaylist = list.tracks.map((track) => track.id).includes(addToPlaylist.id)
            if (alreadyInPlaylist) {
              setExistsInPlaylistModalVisible(true)
              return
            }
            list.tracks = [...list.tracks, addToPlaylist]
          }

          return list
        })
      }

      if (alreadyInPlaylist) {
        return updateState(context, { addToPlaylist: null })
      }
      updateState(context, { addToPlaylist: null, playlist: updatedList, playlistNumber })
      await setAsync('playlist', updatedList)
    }
  }

  const onAudioPressHandler = async (audio) => {
    updateState(context, { isPlaylist: true })
    return await playpause({ audio, context, isPlaylist: true })
  }

  const onRefreshTracksHandler = () => {
    Alert.alert('Refresh tracks?', 'This operation will refresh all the media data', [
      { text: 'Yes', onPress: () => getFiles({ reload: true }) },
      { text: 'No', style: 'cancel' }
    ])
    updateState(context, { playlistNumber: 0 })
  }

  const rowRenderer = (_, item, index, extendedState) => {
    const { isPlaying } = extendedState
    const activeListItem = item.id === currentAudio.id
    return (
      <TracklistItem
        item={item}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        onPress={() => onDotsPressHandler(item)}
        onAudioPress={() => onAudioPressHandler(item)}
      />
    )
  }

  const headerRenderer = () => {
    return (
      <View style={styles.headerContainer}>
        <Text style={{ ...styles.header, ...styles.fontLight, flexGrow: 1 }}>
          Playlist: {playlist[playlistNumber].title}
        </Text>
        <Text style={{ ...styles.header, ...styles.fontLight }}>
          Tracks: {playlist[playlistNumber].tracks.length}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={{ ...styles.addLarge, ...styles.button }}
          onPress={() => setChoosePlaylistModalVisible(true)}
        >
          <Text style={styles.header}>Select playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.add, ...styles.button }}
          onPress={() => setCreatePlaylistModalVisible(true)}
        >
          <MaterialIcons name="add-circle-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.add, ...styles.button }}
          onPress={onDeletePlaylistHandler}
        >
          <MaterialIcons name="delete-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.add, ...styles.button }}
          onPress={onRefreshTracksHandler}
        >
          <MaterialIcons name="refresh" size={28} color="black" />
        </TouchableOpacity>
      </View>
      {!addToPlaylist ? headerRenderer() : null}

      <View style={{ marginTop: 5 }}>
        {!!addToPlaylist &&
          playlist.map((item) => {
            const { id } = item
            return <PlaylistItem key={id} item={item} onPress={onBannerPress} />
          })}
      </View>

      {!addToPlaylist ? (
        <RecyclerListView
          style={styles.list}
          dataProvider={dataProvider.cloneWithRows(playlist[playlistNumber].tracks)}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          extendedState={{ isPlaying }}
        />
      ) : null}
      <ChoosePlaylistModal
        visible={choosePlaylistModalVisible}
        onClose={() => setChoosePlaylistModalVisible(false)}
      />
      <DeleteFromPlaylistModal
        visible={deleteFromPlaylistModalVisible}
        currentItem={currentItem}
        onClose={onCloseDeleteFromPlaylistModal}
        onDelete={deleteFromPlaylistHandler}
      />
      <ExistsInPlaylistModal
        visible={existsInPlaylistModalVisible}
        onClose={() => setExistsInPlaylistModalVisible(false)}
      />
      <CreatePlaylistModal
        visible={createPlaylistModalVisible}
        onClose={() => setCreatePlaylistModalVisible(false)}
        onSubmit={createPlaylistHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    fledDirection: 'column',
    padding: 12,
    flex: 1,
    marginBottom: 78
  },
  topContainer: {
    flexDirection: 'row',
    gap: 5,
    height: 46
  },
  list: {
    flex: 1,
    marginTop: 3
  },
  button: {
    backgroundColor: CREME_DARK,
    borderRadius: 10,
    justifyContent: 'center'
  },
  headerContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  header: {
    fontSize: 17,
    fontWeight: 600
  },
  fontLight: {
    color: CREME
  },
  addLarge: {
    flexGrow: 5,
    paddingLeft: 15
  },
  add: {
    flexGrow: 1,
    alignItems: 'center'
  }
})
