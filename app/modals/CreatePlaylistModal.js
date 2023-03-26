import React, { useEffect, useRef, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'

import { getColors } from '../helpers'
const { MAIN, BG, MODAL_BG } = getColors
const { width } = Dimensions.get('window')

export const CreatePlaylistModal = ({ visible, onClose, onSubmit }) => {
  const nameRef = useRef()
  const [playlistName, setPlaylistName] = useState('')

  useEffect(() => {
    visible && setTimeout(() => nameRef.current.focus(), 10)
  }, [visible])

  const submitHandler = () => {
    if (playlistName.trim()) {
      onSubmit(playlistName)
      setPlaylistName('')
    }
    onClose()
  }

  return (
    <Modal animationType="fade" transparent visible={visible} >
      <View style={styles.modal}>
        <View style={styles.inputContainer}>
          <Text style={styles.modalHeader}>Create new playlist</Text>
          <TextInput
            value={playlistName}
            style={styles.input}
            ref={nameRef}
            onChangeText={(text) => setPlaylistName(text)}
          ></TextInput>
          <MaterialIcons
            name="check-circle"
            size={48}
            color={MAIN}
            style={styles.icon}
            onPress={submitHandler}
          />
        </View>
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
    left: 25,
    bottom: 90,
    borderRadius: 10,
    transition: '1s',
    zIndex: 10
  },
  modalHeader: {
    paddingBottom: 15,
    fontSize: 18,
    color: BG
  },
  inputContainer: {
    width: width - 50,
    padding: 15,
    borderRadius: 10,
    backgroundColor: MAIN,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BG
  },
  input: {
    width: width - 90,
    borderWidth: 1,
    height: 50,
    borderRadius: 10,
    borderColor: BG,
    fontSize: 20,
    padding: 10
  },
  icon: {
    padding: 10,
    color: BG,
    borderRadius: 10,
    marginTop: 15
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
