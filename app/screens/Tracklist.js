import React, { useContext, useEffect, useState, useRef } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'

import { TrackListItem } from '../components/TrackListItem'
import { color } from '../misc/color'
import { getListItemText, getListItemTime } from '../misc/trackListItemHelpers'
import { PlaylistModal } from '../components/PlaylistModal'
import { playpause } from '../misc/audioController'

const { BG } = color

export const Tracklist = ({ navigation }) => {
  const context = useContext(AudioContext)
  const { loadPreviousAudio, updateState, isPlaying, currentAudioIndex, dataProvider } = context
  const [currentItem, setCurrentItem] = useState({})
  const [modalVisible, setModalVisible] = useState(false)

  const layoutProvider = useRef(
    new LayoutProvider(
      (index) => 'audio',
      (type, dim) => {
        dim.width = Dimensions.get('window').width
        dim.height = 68
      }
    )
  ).current

  useEffect(() => {
    loadPreviousAudio()
  }, [])

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
    navigation.navigate('Playlist')
    const newState = { addToPlaylist: currentItem }
    updateState(context, newState)
    setModalVisible(false)
  }

  const rowRenderer = (type, item, index, extendedState) => {
    const { isPlaying, currentAudioIndex } = extendedState
    const { filename, duration } = item
    const time = getListItemTime(duration)
    const activeListItem = currentAudioIndex === index

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

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  }

  return (
    <GestureRecognizer
      onSwipe={(direction, state) => onSwipe(direction, state)}
      config={config}
      style={styles.gestures}
    >
      <RecyclerListView
        style={styles.container}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        extendedState={{ isPlaying, currentAudioIndex }}
      />

      <PlaylistModal
        currentItem={currentItem}
        visible={modalVisible}
        onClose={onModalClose}
        onPlayPress={() => console.log('onPlayPress')}
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
