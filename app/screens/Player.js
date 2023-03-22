import React, { useContext, useRef, useEffect } from 'react'
import { Animated, View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'

import { color } from '../misc/color'
import Screen from '../components/Screen'
import PlayerButton from '../components/PlayerButton'
import { AudioContext } from '../context/AudioProvider'
import { getListItemTime } from '../misc/trackListItemHelpers'
import { play, next, pause, resume } from '../misc/audioController'

const { FONT_LIGHT, MAIN } = color
const { width } = Dimensions.get('window')
const halfWidth = width / 2

export const Player = () => {
  const context = useContext(AudioContext)
  const {
    currentAudio,
    currentAudioIndex,
    totalCount,
    isPlaying,
    playbackPosition,
    playbackDuration,
    playbackObject,
    soundObject,
    updateState,
    audioFiles,
    onPlaybackStatusUpdate,
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

  const prevNext = async (value) => {

    const prev = value === 'prev'
    const counter = prev ? -1 : 1
    const { isLoaded } = await playbackObject.getStatusAsync()
    const endOfList = prev ? currentAudioIndex === 0 : currentAudioIndex + counter === totalCount
    const index = prev
      ? endOfList
        ? totalCount + counter
        : currentAudioIndex + counter
      : endOfList
      ? 0
      : currentAudioIndex + counter
    const audio = audioFiles[index]
    const { uri } = audio
    const { artist, title } = getMetadata(uri)

    let status
    if (!isLoaded && !endOfList) {
      status = await play({ playbackObject, uri, audio, index, artist, title })
    } else if (isLoaded && !endOfList) {
      status = await next({ playbackObject, uri, audio, index, artist, title })
    } else if (isLoaded && endOfList) {
      status = await next({ playbackObject, uri, audio, index, artist, title })
    }

    const newState = {
      currentAudio: audio,
      currentAudioIndex: index,
      playbackObject,
      isPlaying: true,
      soundObject: status
    }

    playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    return updateState(context, newState)
  }

  const playPauseHandler = async () => {
    if (soundObject === null) {
      const { uri } = currentAudio
      const index = currentAudioIndex
      const audio = currentAudio
      const { artist, title } = getMetadata(uri)
      const status = await play({ playbackObject, uri, audio, index, artist, title })
      const newState = {
        soundObject: status,
        currentAudio,
        currentAudioIndex,
        isPlaying: true
      }
      fadeIn()
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)

      return updateState(context, newState)
    } else if (soundObject) {
      if (isPlaying) {
        const status = await pause(playbackObject)
        const newState = { soundObject: status, isPlaying: false }
        fadeOut()

        return updateState(context, newState)
      } else {
        const status = await resume(playbackObject)
        const newState = { soundObject: status, isPlaying: true }
        fadeIn()

        return updateState(context, newState)
      }
    }
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
            <Text style={styles.timerTextLeft}>{getListItemTime(playbackPosition / 1000)}</Text>
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
            <PlayerButton iconType={'PREV'} onPress={() => prevNext('prev')} />
            <PlayerButton iconType={isPlaying ? 'PAUSE' : 'PLAY'} onPress={playPauseHandler} />
            <PlayerButton iconType={'NEXT'} onPress={() => prevNext('next')} />
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
