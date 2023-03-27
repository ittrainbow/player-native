import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

import { getColors } from '../helpers'
const { CREME } = getColors
const { width } = Dimensions.get('window')

export const PlaylistItem = ({ item, index, onPress, active }) => {
  const { tracks, title } = item
  const num = tracks.length
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => onPress(item)}
    >
      <Text style={styles.bannerLeft}>{title}</Text>
      <Text style={styles.bannerRight}>
        {num} {num === 1 ? 'song' : 'songs'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 15,
    marginVertical: 5,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: CREME,
    width: width - 25,
    paddingHorizontal: 10,
    backgroundColor: CREME
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
    width: 65
  }
})
