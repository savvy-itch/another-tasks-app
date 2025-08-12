import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index"
        options={{
          title: 'Today',
          headerShown: false,
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name="calendar"
        options={{
          title: 'Calendar',
          headerShown: false,
          tabBarIcon: () => <AntDesign name="calendar" size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: () => <Ionicons name="settings" size={24} color="black" />
        }}
      />
    </Tabs>
  )
}
