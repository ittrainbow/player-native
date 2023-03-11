import React, { Component } from 'react'
import { StyleSheet, Alert, View, Text } from 'react-native'
import * as MediaLibrary from 'expo-media-library'
import { DataProvider } from 'recyclerlistview'

export const AudioContext = React.createContext()

class AudioProvider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2)
    }
  }

  permissionAlert = () => {
    Alert.alert(
      'Требуется разрешение',
      'Для доступа к аудио-файлам приложению требуется доступ к файловой системе',
      [
        {
          text: 'Согласиться',
          onPress: () => this.getPermission()
        },
        {
          text: 'Отменить',
          onPress: () => this.permissionAlert()
        }
      ]
    )
  }

  getFiles = async () => {
    const { dataProvider, audioFiles } = this.state

    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio'
    })

    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount
    })

    const data = [...audioFiles, ...media.assets]

    // console.log(data)

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows(data),
      audioFiles: data
    })

    // console.log(media.assets.length)
  }

  getPermission = async () => {
    // {"canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
    const permission = await MediaLibrary.getPermissionsAsync()
    const { granted, canAskAgain } = permission

    if (granted) {
      this.getFiles()
    }

    if (!canAskAgain && !granted) {
      this.setState({
        ...this.state,
        permissionError: true
      })
    }

    if (!granted && canAskAgain) {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync()

      if (status === 'denied' && canAskAgain) {
        this.permissionAlert()
      }

      if (status === 'granted') {
        this.getFiles()
      }

      if (status === 'denied' && !canAskAgain) {
        this.setState({
          ...this.state,
          permissionError: true
        })
      }
    }
  }

  componentDidMount() {
    this.getPermission()
  }

  render() {
    const { audioFiles, dataProvider, permissionError } = this.state
    if (permissionError)
      return (
        <View style={styles.audioProviderError}>
          <Text style={styles.audioProviderErrorText}>
            Выдайте разрешение на доступ к файловой системе, может потребоваться переустановка
            приложения
          </Text>
        </View>
      )
    return (
      <AudioContext.Provider value={{ audioFiles, dataProvider }}>
        {this.props.children}
      </AudioContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  audioProviderError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  audioProviderErrorText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'red',
    padding: 15
  }
})

export default AudioProvider
