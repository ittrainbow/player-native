import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { color } from '../misc/color'

const { FONT, FONT_MEDIUM, FONT_LIGHT, BG, ICON, MAIN, CREME } = color
const playIcon = <MaterialIcons name="play-circle-filled" size={36} color={ICON} />
const pauseIcon = <MaterialIcons name="pause-circle-filled" size={36} color={BG} />

export const TrackListItem = ({
  letter,
  trackname,
  time,
  onPress,
  onAudioPress,
  isPlaying,
  activeListItem
}) => {
  const icon = activeListItem ? (isPlaying ? pauseIcon : playIcon) : letter

  return (
    <View style={{ ...styles.container, backgroundColor: activeListItem ? MAIN : CREME }}>
      <TouchableOpacity style={styles.opacity} onPress={onAudioPress} onLongPress={onPress}>
        <View style={styles.leftContainer}>
          <View style={styles.thumbnailContainer}>
            <Text style={styles.thumbnail}>{icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {trackname}
            </Text>
            <Text style={styles.duration}>{time}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <Entypo style={styles.rightIcon} name="dots-three-vertical" size={20} onPress={onPress} />
      </View>
    </View>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: width - 24,
    height: 60,
    marginTop: 5,
    borderRadius: 10
  },
  opacity: {
    padding: 5,
    paddingTop: 9,
    width: width - 80
  },
  leftContainer: {
    flex: 1,
    flexGrow: 7,
    paddingLeft: 5,
    flexDirection: 'row'
  },
  rightContainer: {
    flex: 1,
    width: 100,
    justifyContent: 'flex-start'
  },
  rightIcon: {
    width: 60,
    height: 50,
    paddingLeft: 20,
    paddingTop: 15,
    color: FONT_MEDIUM
  },
  thumbnailContainer: {
    height: 42,
    width: 42,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  thumbnail: {
    fontSize: 22,
    color: FONT
  },
  titleContainer: {
    paddingLeft: 10,
    width: width - 100
  },
  title: {
    fontSize: 16,
    color: FONT
  },
  duration: {
    fontSize: 16,
    color: FONT_LIGHT
  }
})

export default TrackListItem
