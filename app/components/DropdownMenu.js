import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc'

const { CREME_DARK, CREME, BG } = color
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
    updateState(context, { playlistNumber: item._index })
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={data}
        value={value}
        labelField="label"
        valueField="value"
        activeColor={CREME_DARK}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        placeholder={!isFocus ? 'Select playlist' : ''}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value)
          setIsFocus(false)
          onPressHandler(item)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 146,
    marginBottom: 0
  },
  dropdown: {
    height: 56,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: CREME,
    paddingHorizontal: 14,
    marginBottom: 3,
  },
  containerStyle: {
    backgroundColor: BG,
    borderRadius: 10,
    width: width - 24
  },
  itemContainerStyle: {
    borderRadius: 10,
    marginHorizontal: 2,
    marginVertical: 1
  }
})
