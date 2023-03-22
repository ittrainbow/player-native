import React from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'

import { getTrackNames } from '../misc/getTrackNames'
import { getListItemTime } from '../misc/trackListItemHelpers'
import { color } from '../misc/color'
const { CREME, CREME_LIGHT } = color
const { width } = Dimensions.get('window')

const DetailedPlaylistModal = ({ visible, playlist, onClose, onPress }) => {
  const renderTrack = (track) => {
    const { id, uri, duration } = track
    const time = getListItemTime(duration)
    const { artist, title } = getTrackNames(uri)
    const string = `${artist} - ${title}`
    return (
      <View style={styles.itemContainer}>
        <Text key={id} style={styles.itemTrackname}>
          {string.length > 35 ? string.substring(0, 32) + '...' : string}
        </Text>
        <Text style={styles.itemTime}>{time}</Text>
      </View>
    )
  }
  const { title, tracks } = playlist
  return (
    // <View animationType="fade" transparent visible={visible} style={styles.container}>
    //   <ScrollView contentContainerStyle={styles.container}>

    //   </ScrollView>
    //   <TouchableWithoutFeedback onPress={onClose}>
    //     <View style={styles.modalBG} />
    //   </TouchableWithoutFeedback>
    // </View>

    <ScrollView contentContainerStyle={styles.playlist}>
      <Text style={styles.playlistHeader}>{title}</Text>
      {tracks.map((track) => renderTrack(track))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {},
  playlist: {
    marginTop: 5,
    padding: 10,
    gap: 10,
    width: width - 25,
    backgroundColor: CREME,
    justifyContent: 'center',
    borderRadius: 10
  },
  playlistHeader: {
    fontSize: 18,
    fontWeight: 700,
    padding: 5,
    borderRadius: 5,
    textAlign: 'center'
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: CREME_LIGHT,
    borderRadius: 5,
    padding: 10
  },
  itemTrackname: {
    fontSize: 16,
    flexGrow: 1
  },
  itemTime: {
    fontSize: 16
  }
  // modalBG: {
  //   position: 'absolute',
  //   top: 0,
  //   right: 0,
  //   left: 0,
  //   bottom: 5,
  //   backgroundColor: MODAL_BG
  // }
})

export default DetailedPlaylistModal
