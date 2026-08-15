/**
 * Speech Service Module (speech.ts)
 * ---------------------------------
 * Beginner Guide:
 * This module wraps Expo's native `expo-speech` library.
 * It provides Text-To-Speech (TTS) capabilities, allowing the mobile device to
 * read German and English words aloud using native device voice synthesizers.
 */

import * as Speech from 'expo-speech';

/**
 * Speaks a given string out loud in German or English using native text-to-speech.
 * 
 * How it works:
 * 1. Validates that the input string is not empty.
 * 2. Checks if the device is currently speaking another audio clip, and stops it.
 * 3. Passes options (`language`, `pitch`, `rate`, `volume`) to `Speech.speak()`.
 * 
 * @param text - The text phrase to speak
 * @param language - Language code ('de' for German, 'en' for English)
 */
export const speakText = async (text: string, language: 'de' | 'en' = 'de'): Promise<void> => {
  try {
    if (!text || !text.trim()) return;
    
    // Stop any existing speech playing currently to avoid overlapping voices
    const isSpeakingNow = await Speech.isSpeakingAsync().catch(() => false);
    if (isSpeakingNow) {
      await Speech.stop().catch(() => {});
    }
    
    // Configuration options for expo-speech engine
    const options: Speech.SpeechOptions = {
      language: language === 'de' ? 'de' : 'en', // Voice language selection
      pitch: 1.0,                               // Standard pitch level (1.0)
      rate: 0.8,                                // Slightly slower speech rate (0.8) for clear pronunciation
      volume: 1.0,                              // Full audio volume (1.0)
    };
    
    Speech.speak(text, options);
  } catch (error) {
    console.warn('Speech error:', error);
  }
};

/**
 * Immediately halts any active speech playback on the device.
 */
export const stopSpeaking = (): void => {
  try {
    Speech.stop();
  } catch {
    // Ignore error when speech is not active
  }
};

/**
 * Checks if the device speech synthesizer is currently speaking audio.
 * 
 * @returns Promise<boolean> true if audio is playing, false otherwise
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return false;
  }
};

/**
 * Retrieves an array of all native text-to-speech voices installed on the device.
 * 
 * @returns Promise<Speech.Voice[]> List of available voice engines
 */
export const getAvailableVoices = async (): Promise<Speech.Voice[]> => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.warn('Error getting voices:', error);
    return [];
  }
};
