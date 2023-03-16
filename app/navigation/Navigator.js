import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

import { Tracklist, Player, Playlist } from '../screens'
import { color } from '../misc/color'
const { ICON, MAIN, BG, BG_LIGHT } = color

const Tab = createBottomTabNavigator()

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
          borderRadius: 15,
          height: 70,
          borderColor: MAIN,
          backgroundColor: BG_LIGHT
        }
      }}
    >
      <Tab.Screen
        name="Track List"
        component={Tracklist}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="headset" size={36} color={color} style={styles.icon} />
          }
        }}
      />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{
          tabBarIcon: ({ size, color }) => {
            return (
              <MaterialIcons
                name="play-circle-outline"
                size={36}
                color={color}
                style={styles.icon}
              />
            )
          }
        }}
      />
      <Tab.Screen
        name="Playlist3"
        component={Playlist}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="list-alt" size={36} color={color} style={styles.icon} />
          }
        }}
      />
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  icon: {
    // padding: 10,
    // borderRadius: 10,
    // backgroundColor: '#e5e5e5'
  }
})

export default Navigator
