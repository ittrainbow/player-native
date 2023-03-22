import React from 'react'
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

import { getTrackNames } from '../misc/getTrackNames'
import { getListItemTime } from '../misc/trackListItemHelpers'
import { color } from '../misc/color'
const { CREME, CREME_LIGHT } = color
const { width, height } = Dimensions.get('window')

const DetailedPlaylist = ({ playlist }) => {
  const renderTrack = (track) => {
    const { id, uri, duration } = track
    const time = getListItemTime(duration)
    const { artist, title } = getTrackNames(uri)
    const string = `${artist} - ${title}`
    return (
      <TouchableOpacity key={id} style={styles.itemContainer}>
        <Text style={styles.itemTrackname}>
          {string.length > 35 ? string.substring(0, 32) + '...' : string}
        </Text>
        <Text style={styles.itemTime}>{time}</Text>
      </TouchableOpacity>
    )
  }
  const { title, tracks } = playlist
  return (
    <View style={styles.container}>
      <Text style={styles.playlistHeader}>{title}</Text>
      <ScrollView contentContainerStyle={styles.containerScroll}>
        {tracks.map((track) => renderTrack(track))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    padding: 10,
    gap: 10,
    width: width - 25,
    backgroundColor: CREME,
    justifyContent: 'center',
    borderRadius: 10,
    height: height - 277
  },
  containerScroll: {
    gap: 10,
    justifyContent: 'center'
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
})

export default DetailedPlaylist
