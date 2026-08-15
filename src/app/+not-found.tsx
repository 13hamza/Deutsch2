/**
 * NotFoundScreen Component (+not-found.tsx)
 * ----------------------------------------
 * This screen serves as a 404 fallback route in Expo Router.
 * 
 * Beginner Guide:
 * If a link attempts to open a page or screen that doesn't exist in the project,
 * Expo Router will display this page automatically.
 * It provides a clean message and a link to take the user back home safely.
 */

import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      {/* Configure header title for this fallback screen */}
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      
      <View style={styles.container}>
        {/* Error message label */}
        <Text style={styles.title}>{"This screen doesn't exist."}</Text>

        {/* Expo Router Link component acts like an HTML <a> tag to navigate back home */}
        <Link href={"/(tabs)" as any} style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

// StyleSheet encapsulates all component visual styling
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take full screen space
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    padding: 20,
    backgroundColor: '#f5f7f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#2c6b3f',
    fontWeight: '600',
  },
});
