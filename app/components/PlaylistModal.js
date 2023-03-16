import React from 'react'
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback } from 'react-native'

import { getListItemText } from '../misc/trackListItemHelpers'
import { color } from '../misc/color'
const { FONT_MEDIUM, BG, MODAL_BG, MODAL_MAIN_BG } = color

export const PlaylistModal = ({ visible, onClose, currentItem, onPlayPress, onPlaylistPress }) => {
  const { filename } = currentItem
  const { trackname } = filename ? getListItemText(filename) : ''

  return (
    <View style={styles.container}>
      <Modal animationType="fade" transparent visible={visible} style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title} numberOfLines={2}>
            {trackname}
          </Text>
          <View style={styles.optionContainer}>
            <TouchableWithoutFeedback onPress={onPlayPress}>
              <View>
                <Text style={styles.option}>Play</Text>
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
    </View>
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
    backgroundColor: MODAL_MAIN_BG,
    borderWidth: 2,
    borderColor: BG,
    borderRadius: 20,
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
