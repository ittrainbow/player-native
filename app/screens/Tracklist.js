import React, { useContext, useEffect, useState, useRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView } from 'recyclerlistview'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'
import { useIsFocused } from '@react-navigation/native'

import { TrackListItem, PlaylistModal } from '../components'
import { color, swipeConfig, getLayoutProvider, playpause } from '../misc'

const { BG } = color

export const Tracklist = ({ navigation }) => {
  const context = useContext(AudioContext)
  const {
    loadPreviousAudio,
    updateState,
    isPlaying,
    currentAudioIndex,
    dataProvider,
    currentAudio
  } = context
  const [currentItem, setCurrentItem] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const layoutProvider = getLayoutProvider()
  const focused = useIsFocused()

  useEffect(() => {
    loadPreviousAudio()
  }, [])

  useEffect(() => {
    focused && updateState(context, { isPlaylist: false, addToPlaylist: null })
  }, [focused])

  const onModalClose = () => {
    setModalVisible(false)
    setCurrentItem({})
  }

  const onDotsPressHandler = async (item) => {
    setCurrentItem(item)
    setModalVisible(true)
  }

  const onAudioPressHandler = async (audio) => {
    await playpause({ audio, context })
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
      <TrackListItem
        item={item}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        tracklist={true}
        onPress={() => onDotsPressHandler(item)}
        onAudioPress={() => onAudioPressHandler(item)}
      />
    )
  }

  const onSwipe = (gestureName) => {
    const { SWIPE_LEFT } = swipeDirections
    switch (gestureName) {
      case SWIPE_LEFT:
        navigation.navigate('Player')
        break
      default:
        break
    }
  }

  return (
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction, state)}
      config={swipeConfig}
      style={styles.gestures}
    >
      <RecyclerListView
        style={styles.container}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        isPlaying={isPlaying}
        currentAudioIndex={currentAudioIndex}
        extendedState={{ isPlaying, currentAudioIndex }}
      />

      <PlaylistModal
        currentItem={currentItem}
        visible={modalVisible}
        onClose={onModalClose}
        onPlaylistPress={onPlaylistPressHandler}
      />
    </GestureRecognizer>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginBottom: 90,
    backgroundColor: BG
  },
  gestures: {
    flex: 1
  }
})
