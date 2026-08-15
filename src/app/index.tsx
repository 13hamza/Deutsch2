/**
 * Root Index Route (index.tsx)
 * ----------------------------
 * Main entry point redirecting to the tab layout.
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href={"/(tabs)" as any} />;
}