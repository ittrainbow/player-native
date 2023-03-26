import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc'

const { CREME_DARK, CREME, BG, MODAL_BG } = color
const { width } = Dimensions.get('window')

export const DropdownMenu = () => {
  const context = useContext(AudioContext)
  const { updateState, playlist } = context
  const [value, setValue] = useState(null)
  const [data, setData] = useState([])
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    if (playlist) {
      const newData = playlist.map((list) => {
        const { title, tracks } = list
        const num = tracks.length
        const numString = `${title}: ${num} ${num === 1 ? 'song' : 'songs'}`
        return { label: numString }
      })
      setData(newData)
    }
  }, [playlist])

  const onPressHandler = (item) => {
    const { _index: index } = item
    updateState(context, { playlistNumber: index })
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={data}
        value={value}
        label="123"
        labelField="label"
        valueField="value"
        activeColor={CREME}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        placeholder="Select item"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value)
          onPressHandler(item)
          setIsFocus(false)
        }}
      />
      <TouchableWithoutFeedback onPress={() => setIsFocus(false)}>
        <View style={styles.modalBG} />
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 146
  },
  dropdown: {
    height: 46,
    zIndex: 10,
    borderRadius: 10,
    backgroundColor: CREME_DARK,
    paddingHorizontal: 14,
    marginBottom: 3
  },
  containerStyle: {
    backgroundColor: BG,
    borderRadius: 10,
    borderColor: BG,
    width: width - 24,
    marginTop: 2
  },
  itemContainerStyle: {
    borderRadius: 10,
    marginVertical: 5,
    height: 56
  },
  modalBG: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 5,
    backgroundColor: MODAL_BG,
    opacity: .2
  }
})
