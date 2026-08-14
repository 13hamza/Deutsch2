/**
 * TabLayout Component ((tabs)/_layout.tsx)
 * ---------------------------------------
 * Configures the main bottom tab navigation bar for Deutsch2.
 * 
 * Beginner Guide:
 * Expo Router uses `<Tabs>` component to generate bottom tab navigation.
 * Each `<Tabs.Screen>` maps to a file in the `(tabs)` directory:
 * 1. `index` -> `index.tsx` (Translator Screen)
 * 2. `history` -> `history.tsx` (History Screen)
 * 3. `review` -> `review.tsx` (Vocabulary & Sentence Review Screen)
 * 
 * Icons are provided by `@expo/vector-icons` (Ionicons).
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Active tab color (German green tone)
        tabBarActiveTintColor: '#2c6b3f',
        // Inactive tab color
        tabBarInactiveTintColor: 'gray',
        // Top header styling for screens
        headerStyle: {
          backgroundColor: '#2c6b3f',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* 1st Tab: Main Translator Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Translator',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2nd Tab: Translation History Screen */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3rd Tab: Vocabulary Review Screen */}
      <Tabs.Screen
        name="review"
        options={{
          title: 'Review',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
