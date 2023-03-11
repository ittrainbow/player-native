import React from 'react'
import { View, StyleSheet, Modal, Text } from 'react-native'

const PlaylistModal = ({ visible }) => {
  return (
    <Modal visible={visible} style={styles.container}>
      <View>
        <Text></Text>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {}
})

export default PlaylistModal
