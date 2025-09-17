import { useTranslation } from '@/hooks/useTranslation';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const i18n = useTranslation();

  return (
    <Tabs>
      <Tabs.Screen 
        name="index"
        options={{
          title: i18n.t("today"),
          headerShown: false,
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name="calendar"
        options={{
          title: i18n.t("calendar"),
          headerShown: false,
          tabBarIcon: () => <AntDesign name="calendar" size={24} color="black" />
        }}
      />
      <Tabs.Screen 
        name="settings"
        options={{
          title: i18n.t("settings"),
          headerShown: false,
          tabBarIcon: () => <Ionicons name="settings" size={24} color="black" />
        }}
      />
    </Tabs>
  )
}
