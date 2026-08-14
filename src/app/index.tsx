/**
 * Root Index Route (index.tsx)
 * ----------------------------
 * This is the entry point file for Expo Router root level (`/`).
 * 
 * Beginner Guide:
 * When the app launches, it automatically hits this root route.
 * We immediately redirect the user to the `/(tabs)` screen group (the main bottom tab navigation),
 * ensuring the user seamlessly enters the main app interface.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // Automatically redirect to the bottom tab bar layout
  return <Redirect href="/(tabs)" />;
}