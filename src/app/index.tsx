/**
 * Root Index Route (index.tsx)
 * ----------------------------
 * This is the entry point file for Expo Router root level (`/`).
 * 
 * Beginner Explanation:
 * - When the app opens, Expo Router looks for `app/index.tsx` first.
 * - Instead of rendering content directly here, we use `<Redirect>` to forward 
 *   the user straight into the `(tabs)` group so they see the bottom navigation bar.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect immediately forwards the user to the main tab navigation screen group
  return <Redirect href={"/(tabs)" as any} />;
}