import React from 'react'
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { color } from '../misc/color'

const { FONT, FONT_MEDIUM, FONT_LIGHT } = color

{
  /* <MaterialIcons name="play-circle-fill" size={24} color="black" /> */
}

export const AudioListItem = ({ letter, trackname, time, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <Text style={styles.thumbnail}>{letter}</Text>
      </View>
      <View style={styles.leftContainer}>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {trackname}
          </Text>
          <Text style={styles.duration}>{time}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Entypo name="dots-three-vertical" size={20} onPress={onPress} color={FONT_MEDIUM} />
        </View>
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
    padding: 0
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
