import React, { useContext, useState } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { RecyclerListView } from 'recyclerlistview'

import TrackListItem from './TrackListItem'
import { AudioContext } from '../context/AudioProvider'
import { getLayoutProvider } from '../misc/layoutProvider'
import { playpause } from '../misc/audioController'
import { DeleteModal } from './DeleteModal'

const { width, height } = Dimensions.get('window')

const DetailedPlaylist = ({ playlist }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const { tracks } = playlist
  const context = useContext(AudioContext)
  const { dataProvider, currentAudioIndex, isPlaying } = context
  const layoutProvider = getLayoutProvider()

  const onAudioPressHandler = async (audio) => {
    await playpause({ audio, context })
  }

  const onCloseDeleteModal = () => {
    setDeleteModalVisible(false)
    setCurrentItem({})
  }

  const onDotsPressHandler = (item) => {
    setDeleteModalVisible(true)
    setCurrentItem(item)
  }

  const onDeleteFromPlaylist = () => {
    const newTracks = [...playlist.tracks].filter((track) => track.id !== currentItem.id)
    const newPlaylist = { ...playlist, tracks: newTracks }
    console.log(4, newPlaylist)
  }

  const rowRenderer = (type, item, index, extendedState) => {
    const { isPlaying, currentAudioIndex } = extendedState
    const activeListItem = currentAudioIndex === index
    const { id } = item
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
    <View>
      <DeleteModal
        visible={deleteModalVisible}
        currentItem={currentItem}
        onClose={onCloseDeleteModal}
        onDelete={onDeleteFromPlaylist}
      />
      <RecyclerListView
        style={styles.container}
        dataProvider={dataProvider.cloneWithRows(tracks)}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        extendedState={{ isPlaying, currentAudioIndex }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 200,
    marginBottom: 90,
    // backgroundColor: BG
  }
})

export default DetailedPlaylist
