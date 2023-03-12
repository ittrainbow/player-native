import React from 'react'
import { StatusBar } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { View, StyleSheet, Modal, Text } from 'react-native'

import { color } from '../misc/color'
const { FONT_MEDIUM, BG, MODAL_BG, MODAL_MAIN_BG } = color

export const PlaylistModal = ({ visible, onClose, currentItem, trackname }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BG} />
      <Modal animationType="fade" transparent visible={visible} style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{trackname}</Text>
          <View style={styles.optionContainer}>
            <Text style={styles.option}>Option 1</Text>
            <Text style={styles.option}>Option 2</Text>
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
    backgroundColor: 'transparent',
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
