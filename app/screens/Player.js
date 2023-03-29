import React, { useContext, useRef, useEffect, useState } from 'react'
import { Animated, View, StyleSheet, Text, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { useIsFocused } from '@react-navigation/native'

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
const { FONT_LIGHT, MAIN } = getColors
const { width } = Dimensions.get('window')
const halfWidth = width / 2

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
      const { uri, duration, filename } = currentAudio
      const { artist, title } = getMetadata(filename)
      getMetadata(uri)
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
    if (isPlaying) return await pause(playbackObject)
    else return
  }

  const slideResumeHandler = async () => {
    if (soundObject && isPlaying) return await resume(playbackObject)
    else return
  }

  const slideChangeHandler = async (stamp) => {
    // console.log(1, stamp)
    // console.log(2, playbackDuration)
    const newStamp = playbackDuration - Math.floor(stamp) > 2000 ? stamp : playbackDuration - 2000
    await playbackObject.setPositionAsync(newStamp)
    return setPlaybackPosition(newStamp)
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerPlaylistName}>{getPlaylistName()}</Text>
        <Text style={styles.headerAudioCount}>{getCount()}</Text>
      </View>
      <Animated.View style={[styles.playerIcon, { opacity: fadeAnim }]}>
        <MaterialIcons name="library-music" size={240} color={MAIN} />
      </Animated.View>
      <View style={styles.titleContainer}>
        <Text numberOfLine={1} style={styles.titleArtist}>
          {artist}
        </Text>
        <Text numberOfLine={1} style={styles.titleTitle}>
          {title}
        </Text>
      </View>
      <View style={styles.timerContainer}>
        <View style={styles.timer}>
          <Text style={styles.timerTextLeft}>{getTime(playbackPosition)}</Text>
          <Text style={styles.timerTextRight}>
            {getListItemTime(playbackDuration ? playbackDuration / 1000 : duration)}
          </Text>
        </View>
        <Slider
          style={styles.timerSlider}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  //header
  headerContainer: {
    padding: 15,
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
  //player
  playerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280
  },
  //title
  titleContainer: {
    alignItems: 'center'
  },
  titleArtist: {
    fontSize: 22,
    color: FONT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35
  },
  titleTitle: {
    fontSize: 22,
    color: FONT_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    height: 35
  },
  // slider
  timerContainer: {
    left: 25
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
  timerSlider: {
    marginTop: 15,
    width: width - 50,
    height: 40
  },
  //buttons
  playerButtons: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 25,
    gap: 20,
    aligiItems: 'center',
    justifyContent: 'center'
  }
})
