import React, { useContext } from 'react'
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback } from 'react-native'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc/color'
const { FONT_MEDIUM, BG, MODAL_BG, MAIN } = color

export const PlaylistModal = ({ visible, onClose, currentItem, onPlayPress, onPlaylistPress }) => {
  const { currentTitle, logMetadata, track } = useContext(AudioContext)
  const pressHandler1 = () => {
    console.log('1 modal track', track)
    // logMetadata()
  }
  const pressHandler2 = () => {
    console.log('2 modal track', currentTitle)
    // logMetadata()
  }

  return (
    <Modal animationType="fade" transparent visible={visible} style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title} numberOfLines={2}>
          {/* {currentTitle} */}
        </Text>
        <View style={styles.optionContainer}>
          {/* <TouchableWithoutFeedback onPress={onPlayPress}> */}
          <TouchableWithoutFeedback onPress={pressHandler1}>
            <View>
              <Text style={styles.option}>Play</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={pressHandler2}>
            <View>
              <Text style={styles.option}>Log</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onPlaylistPress}>
            <View>
              <Text style={styles.option}>Add to playlist</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBG} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    bottom: 0
  },
  modal: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: MAIN,
    borderWidth: 2,
    borderColor: BG,
    borderRadius: 10,
    transition: '1s',
    zIndex: 10
  },
  optionContainer: {
    padding: 20
  },
  title: {
    fontSize: 24,
    padding: 20,
    paddingBottom: 0,
    color: FONT_MEDIUM
  },
  option: {
    fontSize: 20,
    color: FONT_MEDIUM,
    paddingVertical: 10
  },
  modalBG: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 5,
    backgroundColor: MODAL_BG
  }
})

export default PlaylistModal
