import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'

import { AudioList, Player, Playlist } from '../screens'

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
          height: 75,
          backgroundColor: '#eee'
        }
      }}
    >
      <Tab.Screen
        name="Track List"
        component={AudioList}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="headset" size={size} color={color} />
          }
        }}
      />
      <Tab.Screen
        name="Player2"
        component={Player}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="play-circle-outline" size={size} color={color} />
          }
        }}
      />
      <Tab.Screen
        name="Playlist3"
        component={Playlist}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="list-alt" size={size} color={color} />
          }
        }}
      />
    </Tab.Navigator>
  )
}
export default Navigator
