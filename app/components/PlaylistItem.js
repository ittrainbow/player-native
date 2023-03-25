import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'

import { color } from '../misc'

const { CREME_DARK } = color
const { width } = Dimensions.get('window')

export const PlaylistItem = ({ item, onPress }) => {
  const { tracks, title } = item
  const num = tracks.length
  return (
    <TouchableOpacity style={styles.banner} onPress={() => onPress(item)}>
      <Text style={styles.bannerLeft}>{title}</Text>
      <Text style={styles.bannerRight}>
        {num} {num === 1 ? 'song' : 'songs'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 13,
    height: 56,
    flexDirection: 'row',
    backgroundColor: CREME_DARK,
    marginTop: 4,
    marginBottom: 3,
    borderRadius: 10,
    width: width - 25,
    paddingHorizontal: 10
  },
  bannerLeft: {
    padding: 3,
    fontSize: 16,
    flexGrow: 1,
  },
  bannerRight: {
    opacity: 0.35,
    padding: 3,
    fontSize: 16,
    width: 65
  }
})
