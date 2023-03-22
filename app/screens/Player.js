import React, { useContext, useRef, useEffect, useState } from 'react'
import { Animated, View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

import Screen from '../components/Screen'
import PlayerButton from '../components/PlayerButton'
import { AudioContext } from '../context/AudioProvider'
import { getListItemTime } from '../misc/trackListItemHelpers'
import { playpause, prevnext } from '../misc/audioController'
import { color } from '../misc/color'
const { FONT_LIGHT, MAIN } = color
const { width } = Dimensions.get('window')
const halfWidth = width / 2

export const Player = () => {
  const context = useContext(AudioContext)
  const [prevPlaybackPosition, setPrevPlaybackPosition] = useState('00:00')
  const {
    currentAudio,
    currentAudioIndex,
    totalCount,
    isPlaying,
    playbackPosition,
    playbackDuration,
    getMetadata,
    track
  } = context

  const { currentArtist, currentTitle } = track

  useEffect(() => {
    isPlaying ? fadeIn() : fadeOut()
    if (currentAudio) getMetadata(currentAudio.uri)
  }, [currentAudio])

  const { duration } = currentAudio

  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.2,
      duration: 350,
      useNativeDriver: true
    }).start()
  }

  const calculateSlider = () => {
    return (playbackPosition && playbackDuration && playbackPosition / playbackDuration) || 0
  }

  const prevNextHandler = async (value) => {
    await prevnext({ value, context })
  }

  const playPauseHandler = async () => {
    await playpause({ context, audio: currentAudio })
  }

  const getTime = (playbackPosition) => {
    const response = getListItemTime(playbackPosition / 1000)
    const tics = Number(response.substring(3))
    const oldTics = Number(prevPlaybackPosition.substring(3))
    if (tics > oldTics) {
      setPrevPlaybackPosition(response)
      return response
    }
    return prevPlaybackPosition
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.audioCount}>
          {currentAudioIndex + 1} / {totalCount}
        </Text>
        <Animated.View style={[styles.playerIconContainer, { opacity: fadeAnim }]}>
          <MaterialIcons name="library-music" size={240} color={MAIN} />
        </Animated.View>
        <View style={styles.playerContainer}>
          <Text numberOfLine={1} style={styles.artist}>
            {currentArtist}
          </Text>
          <Text numberOfLine={1} style={styles.title}>
            {currentTitle}
          </Text>
          <View style={styles.timer}>
            <Text style={styles.timerTextLeft}>{getTime(playbackPosition)}</Text>
            <Text style={styles.timerTextRight}>
              {getListItemTime(playbackDuration ? playbackDuration / 1000 : duration)}
            </Text>
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
            <PlayerButton onPress={() => prevNextHandler('prev')} iconType={'PREV'} />
            <PlayerButton onPress={playPauseHandler} iconType={isPlaying ? 'PAUSE' : 'PLAY'} />
            <PlayerButton onPress={() => prevNextHandler('next')} iconType={'NEXT'} />
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
    alignItems: 'center',
    justifyContent: 'center',
    height: 280
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center'
  },
  artist: {
    fontSize: 22,
    color: FONT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35
  },
  title: {
    fontSize: 22,
    color: FONT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35
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
