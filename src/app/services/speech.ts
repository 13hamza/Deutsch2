/**
 * Speech Service Module (speech.ts)
 * ---------------------------------
 * Text-to-Speech (TTS) voice functionality using `expo-speech`.
 */

import * as Speech from 'expo-speech';

/**
 * Speaks text using native device text-to-speech engine
 */
export const speakText = async (text: string, language: 'de' | 'en' = 'de'): Promise<void> => {
  try {
    if (!text || !text.trim()) return;
    
    // Stop any existing speech playing currently
    const isSpeakingNow = await Speech.isSpeakingAsync().catch(() => false);
    if (isSpeakingNow) {
      await Speech.stop().catch(() => {});
    }
    
    const options: Speech.SpeechOptions = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1.0,
      rate: 0.8, // Slightly slower rate for clear language learning pronunciation
      volume: 1.0,
    };
    
    Speech.speak(text, options);
  } catch (error) {
    console.warn('Speech error:', error);
  }
};

/**
 * Halts active speech playback
 */
export const stopSpeaking = (): void => {
  try {
    Speech.stop();
  } catch {
    // Ignore error when speech is not active
  }
};

/**
 * Returns true if speech audio is currently playing
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return false;
  }
};

/**
 * Retrieves array of all available native voices on device
 */
export const getAvailableVoices = async (): Promise<Speech.Voice[]> => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.warn('Error getting voices:', error);
    return [];
  }
};
