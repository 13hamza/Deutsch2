/**
 * RootLayout Component (_layout.tsx)
 * -----------------------------------
 * This is the root wrapper layout of the entire Expo Router application.
 * In Expo Router, files named `_layout.tsx` wrap all child routes inside their folder.
 * 
 * Beginners Guide:
 * 1. SafeAreaProvider: Ensures content is rendered within safe screen boundaries (avoiding notches and status bars).
 * 2. StatusBar: Configures the top status bar appearance (battery level, clock, network icons) for mobile devices.
 * 3. Stack: Navigates between screens in a stack (like a stack of cards, opening screens on top of each other).
 */

import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    // SafeAreaProvider manages padding for device notches (iPhone dynamic island, camera punch holes)
    <SafeAreaProvider>
      {/* Set status bar text to dark style on a clean white background */}
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Stack navigator defines screen transitions */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Main bottom tab navigator (defined in the (tabs) folder) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Fallback 404 page if a user navigates to an unknown route */}
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
