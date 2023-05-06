import { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

import { getColors } from '../helpers'
const { CREME, CREME_LIGHT } = getColors
const { width } = Dimensions.get('window')

export const PlaylistListItem = ({ list, index, onPress, active, selector }) => {
  const [listTitle, setListTitle] = useState('')
  const [listTracks, setListTracks] = useState('')

  useEffect(() => {
    if (list) {
      const { tracks, title } = list
      setListTracks(tracks.length)
      setListTitle(title)
    }
  }, [list])

  return (
    <TouchableOpacity
      style={{
        ...styles.banner,
        backgroundColor: active ? CREME : CREME_LIGHT,
        width: selector ? width - 90 : width - 25
      }}
      onPress={() => onPress(selector ? index : list)}
    >
      <Text style={styles.bannerLeft}>{listTitle}</Text>
      <Text style={styles.bannerRight}>
        {listTracks} {listTracks === 1 ? 'song' : 'songs'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 15,
    flexDirection: 'row',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CREME,
    paddingHorizontal: 10
  },
  bannerLeft: {
    padding: 3,
    fontSize: 16,
    flexGrow: 1
  },
  bannerRight: {
    opacity: 0.35,
    padding: 3,
    fontSize: 16,
    width: 100,
    textAlign: 'right'
  }
})
