import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, Dimensions, Alert } from 'react-native'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'
import { RecyclerListView } from 'recyclerlistview'
import { useIsFocused } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'

import {
  AddPlaylistModal,
  ExistsModal,
  TrackListItem,
  DeleteModal,
  DropdownMenu,
  PlaylistItem
} from '../components'
import { AudioContext } from '../context/AudioProvider'
import { playpause, getLayoutProvider, swipeConfig, color, getAsync, setAsync } from '../misc'
const { CREME } = color

const { width } = Dimensions.get('window')

export const initialPlaylist = (title = '', tracks = []) => {
  return { id: Date.now(), title, tracks }
}

export const Playlists = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [existsVisible, setExistsVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const context = useContext(AudioContext)
  const {
    playlist,
    addToPlaylist,
    updateState,
    playlistNumber,
    dataProvider,
    isPlaying,
    currentAudio
  } = context
  const focused = useIsFocused()
  const layoutProvider = getLayoutProvider()

  useEffect(() => {
    !playlist.length && renderPlaylist()
  }, [])

  useEffect(() => {
    focused && updateState(context, { isPlaylist: true })
  }, [focused])

  // useEffect(() => {
  //   console.log('playlist changed')
  //   playlist.length && setSelectedPlaylist(playlist[playlistNumber])
  // }, [playlist, playlistNumber])

  const onCloseAddPlaylistModal = () => setModalVisible(false)
  const onCloseExistsModal = () => setExistsVisible(false)

  const createPlaylist = async (playlistName) => {
    const response = await getAsync('playlist')

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
      await setAsync('playlist', updatedPlaylist)
    }
    setModalVisible(false)
  }

  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false)
    setCurrentItem({})
  }

  const onDotsPressHandler = (item) => {
    setDeleteModalVisible(true)
    setCurrentItem(item)
  }

  const onAddPlaylistHandler = () => {
    setModalVisible(true)
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

  const onDeleteFromPlaylist = async () => {
    const { id } = currentItem
    const newTracks = [...playlist[playlistNumber].tracks].filter((track) => track.id !== id)
    const newPlaylist = [...playlist]
    newPlaylist[playlistNumber].tracks = newTracks
    updateState(context, { playlist: newPlaylist })
    setDeleteModalVisible(false)
    return await setAsync('playlist', newPlaylist)
  }

  const renderPlaylist = async () => {
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
    const playlistNumber = context.playlist.map(list => list.id).indexOf(modifiedPlaylistID)
    if (addToPlaylist) {
      const response = await getAsync('playlist')
      let updatedList = []
      let alreadyInPlaylist = false

      if (response !== null) {
        updatedList = response.filter((list) => {
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

      if (alreadyInPlaylist) {
        return updateState(context, { addToPlaylist: null })
      }
      updateState(context, { addToPlaylist: null, playlist: updatedList, playlistNumber })
      await setAsync('playlist', updatedList)
    }

    // setSelectedPlaylist(playlist)
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

  const onAudioPressHandler = async (audio) => {
    await playpause({ audio, context })
  }

  const rowRenderer = (_, item, index, extendedState) => {
    const { isPlaying } = extendedState
    const activeListItem = item.id === currentAudio.id
    return (
      <TrackListItem
        item={item}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        onPress={() => onDotsPressHandler(item)}
        onAudioPress={() => onAudioPressHandler(item)}
      />
    )
  }

  return (
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction, state)}
      config={swipeConfig}
      style={styles.flex}
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <DropdownMenu list={playlist} onPress={onBannerPress} style={{ width: width - 120 }} />
          <TouchableOpacity style={styles.add} onPress={onAddPlaylistHandler}>
            <MaterialIcons name="add-circle-outline" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.add} onPress={onDeletePlaylistHandler}>
            <MaterialIcons name="delete-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.playlistString}>
          {playlist.length > 0 &&
            playlist.map((item) => {
              const { id } = item
              return addToPlaylist ? (
                <PlaylistItem key={id} item={item} onPress={onBannerPress} />
              ) : null
            })}
        </View>

        <DeleteModal
          visible={deleteModalVisible}
          currentItem={currentItem}
          onClose={onCloseDeleteModal}
          onDelete={onDeleteFromPlaylist}
        />
        <ExistsModal visible={existsVisible} onClose={onCloseExistsModal} />
        <AddPlaylistModal
          visible={modalVisible}
          onClose={onCloseAddPlaylistModal}
          onSubmit={createPlaylist}
        />
      </View>

      {addToPlaylist ? null : (
        <RecyclerListView
          style={styles.playlist}
          dataProvider={dataProvider.cloneWithRows(playlist[playlistNumber].tracks)}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          extendedState={{ isPlaying }}
        />
      )}
    </GestureRecognizer>
  )
}

const styles = StyleSheet.create({
  container: {
    fledDirection: 'column',
    padding: 12
  },
  flex: {
    flex: 1
  },
  topContainer: {
    flexDirection: 'row',
    gap: 5
  },
  playlist: {
    width: Dimensions.get('window').width,
    marginBottom: 90,
    background: 'red',
    flex: 1
  },
  playlistString: {
    marginTop: 5,
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
  add: {
    height: 54,
    width: 55,
    backgroundColor: CREME,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
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
