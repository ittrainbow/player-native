import React, { useContext } from 'react'
import { View, StyleSheet, Modal, Text, TouchableWithoutFeedback } from 'react-native'

import { Context } from '../context/Context'
import { PlaylistListItem } from '../components'
import { getColors } from '../helpers'
const { MODAL_BG, MAIN, BG } = getColors

export const ChoosePlaylistModal = ({ visible, onClose }) => {
  const context = useContext(Context)
  const { playlist, playlistNumber, setPlaylistNumber } = context

  const onPress = (playlistNumber) => {
    setPlaylistNumber(playlistNumber)
    onClose()
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modal}>
        <Text style={styles.header}>Select playlist</Text>
        {playlist.map((list, index) => {
          return (
            <PlaylistListItem
              key={index}
              list={list}
              index={index}
              onPress={onPress}
              selector={true}
              active={playlistNumber === index}
            />
          )
        })}
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBG} />
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 10
  },
  text: {
    fontSize: 18
  },
  header: {
    fontSize: 20,
    padding: 20
  },
  modal: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    left: 25,
    backgroundColor: MAIN,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BG,
    borderRadius: 10,
    transition: '1s',
    zIndex: 10,
    paddingBottom: 20
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
