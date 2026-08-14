// src/app/services/speech.js
import * as Speech from 'expo-speech';

export const speakText = async (text, language = 'de') => {
  try {
    if (!text) return;
    const isSpeakingNow = await Speech.isSpeakingAsync().catch(() => false);
    if (isSpeakingNow) {
      await Speech.stop().catch(() => {});
    }
    const options = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1,
      rate: 0.8,
      volume: 1,
    };
    Speech.speak(text, options);
  } catch (error) {
    console.warn('Speech error:', error);
  }
};

export const stopSpeaking = () => {
  try {
    Speech.stop();
  } catch (e) {}
};

export const isSpeaking = async () => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (e) {
    return false;
  }
};

export const getAvailableVoices = async () => {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch (error) {
    console.warn('Error getting voices:', error);
    return [];
  }
};