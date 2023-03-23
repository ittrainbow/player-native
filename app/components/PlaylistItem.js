import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { color } from '../misc/color'
const { CREME_DARK } = color
const { width } = Dimensions.get('window')

const PlaylistItem = ({ item, onPress }) => {
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
    padding: 10,
    height: 50,
    flexDirection: 'row',
    backgroundColor: CREME_DARK,
    margin: 5,
    borderRadius: 10,
    width: width - 25
  },
  bannerLeft: {
    padding: 3,
    fontSize: 16,
    flexGrow: 1,
    width: 100,
  },
  bannerRight: {
    opacity: 0.25,
    padding: 3,
    fontSize: 16
  }
})

export default PlaylistItem