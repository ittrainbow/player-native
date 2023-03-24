import React, { useContext, useRef, useEffect, useState } from 'react'
import { Animated, View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures'

import Screen from '../components/Screen'
import PlayerButton from '../components/PlayerButton'
import { AudioContext } from '../context/AudioProvider'
import { getListItemTime } from '../misc/trackListItemHelpers'
import { pause, resume, playpause, prevnext } from '../misc/audioController'
import { swipeConfig } from '../misc/swipeConfig'
import { color } from '../misc/color'
const { FONT_LIGHT, MAIN } = color
const { width } = Dimensions.get('window')
const halfWidth = width / 2

export const Player = ({ navigation }) => {
  const [duration, setDuration] = useState(0)
  const context = useContext(AudioContext)
  const {
    currentAudio,
    currentAudioIndex,
    totalCount,
    isPlaying,
    playbackObject,
    playbackPosition,
    playbackDuration,
    getMetadata,
    soundObject,
    track,
    updateState
  } = context

  const { currentArtist, currentTitle } = track

  useEffect(() => {
    isPlaying ? fadeIn() : fadeOut()
    if (currentAudio) {
      const { uri, duration } = currentAudio
      getMetadata(uri)
      setDuration(duration)
    }
  }, [currentAudio, isPlaying])

  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.2,
      duration: 250,
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
    return response
  }

  const slidePauseHandler = async () => {
    if (isPlaying) return await pause(playbackObject)
    else return
  }

  const slideResumeHandler = async () => {
    if (soundObject && isPlaying) return await resume(playbackObject)
    else return
  }

  const slideChangeHandler = async (stamp) => {
    await playbackObject.setPositionAsync(stamp)
    return updateState(context, { playbackPosition: stamp })
  }

  const onSwipe = (gestureName) => {
    const { SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections
    switch (gestureName) {
      case SWIPE_LEFT:
        navigation.navigate('Playlist')
        break
      case SWIPE_RIGHT:
        navigation.navigate('Tracklist')
        break
      default:
        break
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <GestureRecognizer
          onSwipe={(direction, state) => onSwipe(direction, state)}
          config={swipeConfig}
        >
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
          </View>
          <View style={styles.timeSlide}>
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
              onValueChange={(value) => slideChangeHandler(value * duration * 1000)}
              onSlidingStart={slidePauseHandler}
              onSlidingComplete={slideResumeHandler}
            />
          </View>
          <View style={styles.playerButtons}>
            <PlayerButton onPress={() => prevNextHandler('prev')} iconType={'PREV'} />
            <PlayerButton onPress={playPauseHandler} iconType={isPlaying ? 'PAUSE' : 'PLAY'} />
            <PlayerButton onPress={() => prevNextHandler('next')} iconType={'NEXT'} />
          </View>
        </GestureRecognizer>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  timeSlide: {
    left: 25,
    marginTop: 65
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
    gap: 40,
    left: width / 2 - 110
  }
})
