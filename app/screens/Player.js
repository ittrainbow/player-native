import React, { useContext } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

import { color } from '../misc/color'
import Screen from '../components/Screen'
import PlayerButton from '../components/PlayerButton'
import { AudioContext } from '../context/AudioProvider'
import { getListItemTime } from '../misc/trackListItemHelpers'

const { FONT_LIGHT, MAIN } = color
const { width } = Dimensions.get('window')
const halfWidth = width / 2

export const Player = () => {
  const context = useContext(AudioContext)
  const {
    currentAudioIndex,
    totalCount,
    currentTrackname,
    isPlaying,
    playbackPosition,
    playbackDuration
  } = context

  const calculateSlider = () => {
    return (playbackPosition && playbackDuration && playbackPosition / playbackDuration) || 0
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>
          {currentAudioIndex + 1} / {totalCount}
        </Text>
        <View style={styles.playerIconContainer}>
          <MaterialIcons name="library-music" size={240} color={MAIN} />
        </View>
        <View style={styles.playerContainer}>
          <Text numberOfLine={1} style={styles.title}>
            {currentTrackname}
          </Text>
          <View style={styles.timer}>
            <Text style={styles.timerTextLeft}>{getListItemTime(playbackPosition / 1000)}</Text>
            <Text style={styles.timerTextRight}>{getListItemTime(playbackDuration / 1000)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={calculateSlider()}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
          />
          <View style={styles.playerButtons}>
            <PlayerButton iconType={'PREV'} onPress={() => console.log('PRESS')} />
            <PlayerButton iconType={isPlaying ? 'PAUSE' : 'PLAY'} />
            <PlayerButton iconType={'NEXT'} />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  audioCount: {
    textAlign: 'right',
    padding: 15,
    color: FONT_LIGHT,
    fontSize: 16
  },
  playerIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    color: MAIN,
    alignItems: 'center'
  },
  timer: {
    flexDirection: 'row',
    paddingTop: 5,
    width: width - 50
  },
  timerTextLeft: {
    width: halfWidth,
    color: FONT_LIGHT,
    textAlign: 'left'
  },
  timerTextRight: {
    width: halfWidth - 50,
    color: FONT_LIGHT,
    textAlign: 'right'
  },
  slider: {
    marginTop: 15,
    width: width - 50,
    height: 40
  },
  playerButtons: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 25,
    gap: 40
  }
})
