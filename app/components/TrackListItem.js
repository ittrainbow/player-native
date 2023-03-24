import React from 'react'
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { getListItemText, getListItemTime, color } from '../misc'

const { FONT, FONT_MEDIUM, FONT_LIGHT, BG, ICON, MAIN, CREME, CREME_DARK } = color
const playIcon = <MaterialIcons name="play-circle-filled" size={36} color={ICON} />
const pauseIcon = <MaterialIcons name="pause-circle-filled" size={36} color={BG} />

const { width } = Dimensions.get('window')

export const TrackListItem = ({
  item,
  isPlaying,
  activeListItem,
  onPress,
  onAudioPress
}) => {
  const { filename, duration } = item
  const { letter, trackname } = getListItemText(filename)
  const time = getListItemTime(duration)
  const tracknameSplit = trackname.split(' - ')
  const artist = tracknameSplit[0]
  const title = tracknameSplit[1]
  const icon = activeListItem ? (isPlaying ? pauseIcon : playIcon) : letter

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: activeListItem ? MAIN : CREME
      }}
    >
      <TouchableOpacity style={styles.opacity} onPress={onAudioPress} onLongPress={onPress}>
        <View style={styles.leftContainer}>
          <View style={styles.thumbnailContainer}>
            <Text style={styles.thumbnail}>{icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {artist}
            </Text>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </View>
          <Text style={styles.duration}>{time}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        <MaterialIcons name="more-vert" size={28} color="black" onPress={onPress}/>
      </View>
    </View>
  )
}

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
    width: 80,
    alignItems: 'center'
  },
  rightIcon: {
    width: 60,
    height: 50,
    paddingLeft: 25,
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
    paddingHorizontal: 7,
    width: width - 155
  },
  title: {
    fontSize: 16,
    color: FONT
  },
  duration: {
    fontSize: 16,
    paddingTop: 10,
    color: FONT_LIGHT
  }
})
