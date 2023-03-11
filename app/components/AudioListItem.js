import React from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { color } from '../misc/color'

const { FONT, FONT_MEDIUM, FONT_LIGHT } = color

{
  /* <MaterialIcons name="play-circle-fill" size={24} color="black" /> */
}

const getListItemText = (filename) => {
  const letterNum = /[a-zA-Zа-яА-Я]/i.exec(filename).index

  const letter = filename.charAt(letterNum).toUpperCase()
  const trackname = filename.replace('.mp3', '').substring(letterNum)

  return { letter, trackname }
}

const getListItemTime = (duration) => {
  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration) - 60 * minutes
  const leadZero = (val) => (val < 9 ? '0' : '')
  return `${leadZero(minutes)}${minutes}:${leadZero(seconds)}${seconds}`
}

const AudioListItem = ({ letter, trackname, time, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.thumbnailContainer}>
          <Text style={styles.thumbnail}>{letter}</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {trackname}
          </Text>
          <Text style={styles.duration}>{time}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Entypo name="dots-three-vertical" size={20} color={FONT_MEDIUM} onPress={onPress} />
      </View>
    </View>
  )
}

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: width - 24,
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  rightContainer: {
    alignSelf: 'center',
    padding: 5
  },
  thumbnailContainer: {
    height: 40,
    width: 40,
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

export default AudioListItem
