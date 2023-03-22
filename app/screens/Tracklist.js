import React, { Component } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'

import { TrackListItem } from '../components/TrackListItem'
import { color } from '../misc/color'
import { getListItemText, getListItemTime } from '../misc/trackListItemHelpers'
import { PlaylistModal } from '../components/PlaylistModal'
import { playpause } from '../misc/audioController'

const { BG } = color

export class Tracklist extends Component {
  static contextType = AudioContext

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false
    }

    this.currentItem = {}
  }

  layoutProvider = new LayoutProvider(
    (index) => 'audio',
    (type, dim) => {
      dim.width = Dimensions.get('window').width
      dim.height = 68
    }
  )

  componentDidMount() {
    this.context.loadPreviousAudio()
  }

  onModalClose = () => {
    this.setState({ ...this.state, modalVisible: false })
    this.currentItem = {}
  }

  onDotsPressHandler = async (item) => {
    this.currentItem = item
    this.setState({ ...this.state, modalVisible: true })
  }

  onAudioPressHandler = async (audio) => {
    await playpause({ audio, context: this.context })
  }

  onPlaylistPressHandler = () => {
    const newState = { addToPlaylist: this.currentItem }
    this.context.updateState(this.context, newState)
    this.props.navigation.navigate('Playlist')
    this.setState({ modalVisible: false })
  }

  rowRenderer = (_, item, index, extendedState) => {
    const { isPlaying, currentAudioIndex } = extendedState
    const { filename, duration, uri } = item
    const { onDotsPressHandler, onAudioPressHandler } = this
    const { letter, trackname } = getListItemText(filename)
    const time = getListItemTime(duration)
    const activeListItem = currentAudioIndex === index

    return (
      <TrackListItem
        letter={letter}
        isPlaying={isPlaying}
        activeListItem={activeListItem}
        trackname={trackname}
        time={time}
        onPress={() => onDotsPressHandler(item)}
        onAudioPress={() => onAudioPressHandler(item)}
      />
    )
  }

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying, currentAudioIndex }) => {
          const { modalVisible } = this.state
          const { currentItem, onModalClose, layoutProvider, rowRenderer, onPlaylistPressHandler } =
            this
          return (
            <>
              <RecyclerListView
                style={styles.container}
                dataProvider={dataProvider}
                layoutProvider={layoutProvider}
                rowRenderer={rowRenderer}
                extendedState={{ isPlaying, currentAudioIndex }}
              />
              <PlaylistModal
                currentItem={currentItem}
                visible={modalVisible}
                onClose={onModalClose}
                onPlayPress={() => console.log('onPlayPress')}
                onPlaylistPress={onPlaylistPressHandler}
              />
            </>
          )
        }}
      </AudioContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    marginBottom: 90,
    backgroundColor: BG
  }
})
