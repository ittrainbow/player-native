import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback, Dimensions } from 'react-native'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc'

const { FONT_MEDIUM, BG, MODAL_BG, MAIN, CREME_LIGHT } = color
const { width } = Dimensions.get('window')

export const DeleteFromPlaylistModal = ({ visible, onClose, currentItem, onDelete }) => {
  const { getMetadata } = useContext(AudioContext)
  const [artist, setArtist] = useState(null)
  const [title, setTitle] = useState(null)

  useEffect(() => {
    if (visible) {
      const { uri } = currentItem
      const { artist, title } = getMetadata(uri)
      setArtist(artist)
      setTitle(title)
    }
  }, [visible])

  return (
    <Modal animationType="fade" transparent visible={visible} >
      <View style={styles.modal}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{artist}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableWithoutFeedback onPress={onDelete}>
            <View style={styles.centered}>
              <Text style={styles.option}>Delete from playlist</Text>
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
  centered: {
    backgroundColor: CREME_LIGHT,
    borderRadius: 10,
    alignItems: 'center',
    width: width / 2
  },
  modal: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    left: 20,
    backgroundColor: MAIN,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BG,
    borderRadius: 10,
    transition: '1s',
    zIndex: 10
  },
  titleContainer: {
    gap: 10,
    padding: 25,
    paddingBottom: 10
  },
  buttonsContainer: {
    gap: 20,
    padding: 25,
    paddingTop: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    color: FONT_MEDIUM
  },
  option: {
    fontSize: 18,
    fontWeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    color: FONT_MEDIUM,
    paddingVertical: 10
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

