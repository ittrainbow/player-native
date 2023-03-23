import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

import { Tracklist, Player, Playlist } from '../screens'
import { color } from '../misc/color'
const { MAIN, BG_LIGHT } = color

const Tab = createBottomTabNavigator()
const tabs = [
  { name: 'Tracklist', component: Tracklist, icon: 'headset' },
  { name: 'Player', component: Player, icon: 'play-circle-outline' },
  { name: 'Playlist', component: Playlist, icon: 'list-alt' }
]

const Navigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          elevation: 0,
          bottom: 12,
          left: 12,
          right: 12,
          borderRadius: 10,
          height: 70,
          borderColor: MAIN,
          backgroundColor: BG_LIGHT
        }
      }}
    >
      {tabs.map((tab) => {
        const { name, component, icon } = tab
        return (
          <Tab.Screen
            key={Math.random()}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ color }) => {
                return <MaterialIcons name={icon} size={36} color={color} style={styles.icon} />
              }
            }}
          />
        )
      })}
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({})

export default Navigator
