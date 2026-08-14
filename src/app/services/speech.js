/**
 * Speech Service Module (speech.js)
 * ---------------------------------
 * Helper module encapsulating Text-to-Speech (TTS) voice functionality using `expo-speech`.
 * 
 * Beginners Guide:
 * 1. `speakText(text, language)`: Stops any active speech playback and speaks the text string in German ('de') or English ('en').
 * 2. `stopSpeaking()`: Immediately halts ongoing speech synthesis.
 * 3. `isSpeaking()`: Checks if speech is currently outputting audio.
 * 4. `getAvailableVoices()`: Returns list of installed system TTS voice engines.
 */

import * as Speech from 'expo-speech';

/**
 * Speaks text using native device text-to-speech voice
 * @param {string} text - The text to speak
 * @param {string} language - Language code ('de' for German, 'en' for English)
 */
export const speakText = async (text, language = 'de') => {
  try {
    if (!text) return;
    
    // Stop any existing speech playing currently
    const isSpeakingNow = await Speech.isSpeakingAsync().catch(() => false);
    if (isSpeakingNow) {
      await Speech.stop().catch(() => {});
    }
    
    // Voice configuration options
    const options = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1.0,  // Standard voice pitch
      rate: 0.8,   // Slightly slower speech rate for optimal language learning clarity
      volume: 1.0, // Maximum volume
    };
    
    Speech.speak(text, options);
  } catch (error) {
    console.warn('Speech error:', error);
  }
};

/**
 * Stops ongoing speech playback
 */
export const stopSpeaking = () => {
  try {
    Speech.stop();
  } catch (e) {}
};

/**
 * Returns true if speech audio is currently playing
 */
export const isSpeaking = async () => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (e) {
    return false;
  }
};

/**
 * Retrieves array of all available native voices on device
 */
export const getAvailableVoices = async () => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.warn('Error getting voices:', error);
    return [];
  }
};