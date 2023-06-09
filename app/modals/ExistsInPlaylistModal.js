import React from 'react'
import { View, StyleSheet, Text, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native'

import { getColors } from '../helpers'

const { MAIN, MODAL_BG, FONT_MEDIUM, BG } = getColors
const { width, height } = Dimensions.get('window')

export const ExistsInPlaylistModal = ({ visible, onClose }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modal}>
        <Text style={styles.alert}>This file already added to playlist</Text>
        <Text style={styles.alert} onPress={onClose}>
          OK
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBG} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    padding: 20,
    bottom: 90,
    left: 25,
    gap: 30,
    width: width - 50,
    backgroundColor: MAIN,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BG,
    borderRadius: 10,
    transition: '1s',
    zIndex: 10
  },
  alert: {
    fontSize: 18,
    textAlign: 'center',
    color: FONT_MEDIUM
  },
  modalBG: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: MODAL_BG
  }
})
