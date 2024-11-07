import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="video"
        options={{
          title: 'Video',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'videocam' : 'videocam-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contactos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Acerca de',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
