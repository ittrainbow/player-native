import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { color } from '../misc/color'
const { CREME_DARK, CREME, BG } = color
const { width } = Dimensions.get('window')

const DropdownMenu = ({ list, onPress }) => {
  const [data, setData] = useState([])
  const [value, setValue] = useState(null)
  const [isFocus, setIsFocus] = useState(false)

  useEffect(() => {
    const newData = list.map((list) => {
      const { title, tracks } = list
      const num = tracks.length
      const numString = `${title}: ${num} ${num === 1 ? 'song' : 'songs'}`
      return { label: numString }
    })

    setData(newData)
  }, [list])

  const onPressHandler = (item) => {
    const { _index } = item
    onPress(list[_index])
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
          setValue(item.value)
          setIsFocus(false)
          onPressHandler(item)
        }}
      />
    </View>
  )
}

export default DropdownMenu

const styles = StyleSheet.create({
  container: {
    width: width - 25,
    marginBottom: 5
  },
  dropdown: {
    height: 60,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: CREME,
    paddingHorizontal: 14
  },
  containerStyle: {
    backgroundColor: BG,
    borderRadius: 10,
    padding: 2
  },
  itemContainerStyle: {
    borderRadius: 10,
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  }
})
