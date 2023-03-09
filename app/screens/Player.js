import React, { useContext, useRef, useEffect, useState } from 'react'
import { Animated, View, StyleSheet, Text, Dimensions, Easing } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useIsFocused } from '@react-navigation/native'
import TextTicker from 'react-native-text-ticker'

import { PlayerButton } from '../UI'
import {
  pause,
  resume,
  playpause,
  prevnext,
  getListItemTime,
  getColors,
  setAsync
} from '../helpers'
import { Context } from '../context/Context'
const { FONT_LIGHT, FONT_BRIGHT, CREME_DARK } = getColors
const { width } = Dimensions.get('window')

export const Player = () => {
  const focused = useIsFocused()
  const [duration, setDuration] = useState(0)
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const context = useContext(Context)
  const {
    currentAudio,
    totalCount,
    isPlaying,
    isPlaylist,
    playbackObject,
    playbackPosition,
    playbackDuration,
    getMetadata,
    soundObject,
    shuffle,
    playlist,
    playlistNumber,
    getNextAudio,
    audioFiles,
    setAddToPlaylist,
    setPlaylist,
    setPlaybackPosition,
    setShuffle
  } = context

  useEffect(() => {
    if (focused) setAddToPlaylist(null)
  }, [focused])

  useEffect(() => {
    if (currentAudio) {
      const { duration, filename } = currentAudio
      const { artist, title } = getMetadata(filename)
      setDuration(duration)
      setArtist(artist)
      setTitle(title)
    }
  }, [currentAudio])

  useEffect(() => {
    isPlaying ? fadeIn() : fadeOut()
  }, [isPlaying])

  const fadeAnim = useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.2,
      duration: 350,
      useNativeDriver: true
    }).start()
  }

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.04,
      duration: 350,
      useNativeDriver: true
    }).start()
  }

  const calculateSlider = () => {
    return (playbackPosition && playbackDuration && playbackPosition / playbackDuration) || 0
  }

  const prevNextHandler = async (value) => {
    const audio = await getNextAudio({ value })
    const random = audioFiles[Math.floor(Math.random() * totalCount)]
    const nextAudio = audio || random
    await prevnext({ value, context, nextAudio })
  }

  const playPauseHandler = async () => {
    await playpause({ context, audio: currentAudio })
  }

  const getTime = (playbackPosition) => {
    const response = getListItemTime(playbackPosition / 1000)
    return response
  }

  const slidePauseHandler = async () => {
    if (soundObject && isPlaying) return await pause(playbackObject)
    else return
  }

  const slideResumeHandler = async () => {
    if (soundObject && isPlaying) return await resume(playbackObject)
    else return
  }

  const slideChangeHandler = async (stamp) => {
    const isTrackEnd = playbackDuration - Math.floor(stamp) > 2000
    const newStamp = isTrackEnd ? stamp : playbackDuration - 2000
    if (soundObject && playbackDuration) {
      await playbackObject.setPositionAsync(newStamp)
      return setPlaybackPosition(newStamp)
    }
  }

  const getCount = () => {
    const { id } = currentAudio ? currentAudio : 0
    const list = isPlaylist ? playlist[playlistNumber].tracks : audioFiles
    const total = isPlaylist ? list.length : totalCount
    const num = list.map((el) => el.id).indexOf(id)

    return `${num + 1} / ${total}`
  }

  const checkFav = () => {
    if (currentAudio) {
      const favs = playlist
        .filter((list) => list.title === 'Favorites')[0]
        .tracks.map((track) => track.id)

      return favs.filter((el) => el === currentAudio.id).length === 1
    }
  }

  const onFavHandler = async () => {
    const favPlaylistNumber = playlist.map((list) => list.title).indexOf('Favorites')
    const getTracks = [...playlist[favPlaylistNumber].tracks]
    let newTracks
    if (!checkFav()) newTracks = getTracks.concat([currentAudio])
    else {
      getTracks.splice(getTracks.map((track) => track.id).indexOf(currentAudio.id), 1)
      newTracks = [...getTracks]
    }
    const newPlaylist = [...playlist]
    newPlaylist[favPlaylistNumber].tracks = newTracks
    setPlaylist(newPlaylist)
    return await setAsync('playlist', newPlaylist)
  }

  const shuffleHandler = () => {
    setShuffle(!shuffle)
  }

  const getPlaylistName = () => {
    return isPlaylist ? `Playlist: ${playlist[playlistNumber].title}` : `All Tracks`
  }

  const returnScroll = (line) => {
    return line.length > 32 ? (
      <TextTicker
        style={styles.titleScroll}
        duration={line.length * 200}
        repeatSpacer={50}
        animationType={'auto'}
        easing={Easing.linear}
      >
        {line}
      </TextTicker>
    ) : (
      <Text style={styles.titleText}>{line}</Text>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerPlaylistName}>{getPlaylistName()}</Text>
        <Text style={styles.headerAudioCount}>{getCount()}</Text>
      </View>
      <Animated.View style={{ ...styles.iconContainer, opacity: fadeAnim }}>
        <MaterialCommunityIcons name="music-circle-outline" size={440} color={CREME_DARK} />
      </Animated.View>
      <View style={styles.bottomContainer}>
        <View style={styles.title}>
          {returnScroll(artist)}
          {returnScroll(title)}
        </View>
        <View style={styles.timer}>
          <Text style={styles.timerText}>{getTime(playbackPosition)}</Text>
          <Text style={styles.timerText}>
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
        <View style={styles.buttons}>
          <PlayerButton
            onPress={onFavHandler}
            iconType={checkFav() ? 'FAVORITE' : 'FAVORITE-OUTLINE'}
            size={28}
          />
          <PlayerButton onPress={() => prevNextHandler('prev')} iconType={'PREV'} />
          <PlayerButton onPress={playPauseHandler} iconType={isPlaying ? 'PAUSE' : 'PLAY'} />
          <PlayerButton onPress={() => prevNextHandler('next')} iconType={'NEXT'} />
          <PlayerButton
            onPress={shuffleHandler}
            iconType={shuffle ? 'SHUFFLE-ON' : 'SHUFFLE'}
            size={30}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 45,
    flexDirection: 'row'
  },
  headerPlaylistName: {
    textAlign: 'left',
    color: FONT_LIGHT,
    fontSize: 16,
    flexGrow: 1
  },
  headerAudioCount: {
    textAlign: 'right',
    color: FONT_LIGHT,
    fontSize: 16
  },
  iconContainer: {
    width: width + 100,
    left: -50,
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    left: 25,
    width: width - 50,
    bottom: 122,
    gap: 20
  },
  title: {
    flex: 1,
    alignItems: 'center',
    gap: 5
  },
  titleScroll: {
    fontSize: 22,
    color: FONT_BRIGHT,
    height: 35,
    width: width - 50
  },
  titleText: {
    fontSize: 22,
    color: FONT_BRIGHT,
    height: 35
  },
  timer: {
    flexDirection: 'row',
    width: width - 50,
    justifyContent: 'space-between'
  },
  timerText: {
    color: FONT_LIGHT
  },
  slider: {
    width: width - 50,
    height: 40
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 17
  }
})
