import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { AudioContext } from '../context/AudioProvider'
import { color } from '../misc'

const { CREME_DARK, CREME, BG } = color
const { width } = Dimensions.get('window')

export const DropdownMenu = ({ list, onPress }) => {
  const context = useContext(AudioContext)
  const { updateState, playlist, playlistNumber } = context
  const [data, setData] = useState([])
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    if (list) {
      const newData = list.map((list) => {
        const { title, tracks } = list
        const num = tracks.length
        const numString = `${title}: ${num} ${num === 1 ? 'song' : 'songs'}`
        return { label: numString }
      })

      setData(newData)
    }
  }, [list])

  // useEffect(() => {
  //   const { title, tracks } = playlist[playlistNumber]
  //   const num = tracks.length
  //   const numString = `${title}: ${num} ${num === 1 ? 'song' : 'songs'}`
  //   setValue(numString)
  // }, [playlistNumber])

  const onPressHandler = (item) => {
    console.log(item)
    const { _index: index } = item
    onPress(list[index])
    updateState(context, { playlistNumber: index })
  }

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={data}
        labelField="label"
        valueField="value"
        activeColor={CREME_DARK}
        containerStyle={styles.containerStyle}
        itemContainerStyle={styles.itemContainerStyle}
        placeholder={!isFocus ? 'Select playlist' : ''}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setIsFocus(false)
          onPressHandler(item)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 144,
    marginBottom: 5
  },
  dropdown: {
    height: 55,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: CREME,
    paddingHorizontal: 14
  },
  containerStyle: {
    backgroundColor: BG,
    borderRadius: 10,
    padding: 3
  },
  itemContainerStyle: {
    borderRadius: 10
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  }
})
