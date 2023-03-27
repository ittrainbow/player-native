import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { Context } from '../context/Context'
import { RecyclerListView } from 'recyclerlistview'
import { useIsFocused } from '@react-navigation/native'

import { TracklistItem } from '../components'
import { getColors, getLayoutProvider, playpause } from '../helpers'
import { AddToPlaylistModal } from '../modals'

const { BG } = getColors

export const Tracklist = ({ navigation }) => {
  const focused = useIsFocused()
  const context = useContext(Context)
  const {
    loadPreviousAudio,
    audioFiles,
    updateState,
    isPlaying,
    currentAudioIndex,
    dataProvider,
    currentAudio
  } = context
  const [currentItem, setCurrentItem] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const layoutProvider = getLayoutProvider()

  useEffect(() => {
    audioFiles && loadPreviousAudio()
  }, [audioFiles])

  useEffect(() => {
    if (focused) updateState({ ...context, addToPlaylist: null })
  }, [focused])

  const onModalClose = () => {
    setModalVisible(false)
    return setCurrentItem({})
  }

  const onDotsPressHandler = async (item) => {
    setCurrentItem(item)
    return setModalVisible(true)
  }

  const onAudioPressHandler = async (audio) => {
    updateState(context, { isPlaylist: false, addToPlaylist: null })
    return await playpause({ audio, context, isPlaylist: false })
  }

  const onPlaylistPressHandler = () => {
    navigation.navigate('Playlists')
    const newState = { addToPlaylist: currentItem }
    updateState(context, newState)
    setModalVisible(false)
  }

  const rowRenderer = (type, item, index, extendedState) => {
    const { isPlaying } = extendedState
    const activeListItem = currentAudio ? item.id === currentAudio.id : false

    return (
      <TracklistItem
        item={item}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        tracklist={true}
        onPress={() => onDotsPressHandler(item)}
        onAudioPress={() => onAudioPressHandler(item)}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <RecyclerListView
        style={styles.container}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        isPlaying={isPlaying}
        currentAudioIndex={currentAudioIndex}
        extendedState={{ isPlaying, currentAudioIndex }}
      />

      <AddToPlaylistModal
        currentItem={currentItem}
        visible={modalVisible}
        onClose={onModalClose}
        onPlaylistPress={onPlaylistPressHandler}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginBottom: 90,
    backgroundColor: BG
  }
})
