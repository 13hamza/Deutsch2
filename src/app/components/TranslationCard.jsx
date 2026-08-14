/**
 * TranslationCard Component (TranslationCard.jsx)
 * ----------------------------------------------
 * Card view component displaying German text, interactive individual word pills, and English translation.
 * 
 * Beginners Guide:
 * 1. expo-speech (`Speech.speak`): Converts string text into spoken audio pronunciation using native device voice capabilities.
 * 2. Word breakdown: Automatically splits German sentences into individual clickable word pills. Tapping a pill pronounces just that specific word!
 * 3. Audio state: Toggles volume icon while text is being spoken.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const TranslationCard = ({ germanText, englishText }) => {
  // Tracks if audio speech is currently active
  const [speaking, setSpeaking] = useState(false);

  /**
   * Speaks target text using specified language code ('de' for German, 'en' for English)
   */
  const speakText = (text, language) => {
    const options = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1,
      rate: 0.8, // Slightly lower rate for clear language learning pronunciation
      onStart: () => setSpeaking(true),
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    };
    try {
      Speech.speak(text, options);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  /**
   * Stops currently playing audio speech
   */
  const stopSpeaking = () => {
    try {
      Speech.stop();
    } catch (e) {}
    setSpeaking(false);
  };

  /**
   * Toggles speech playback on/off
   */
  const handleSpeak = (text, language) => {
    if (speaking) {
      stopSpeaking();
    } else {
      speakText(text, language);
    }
  };

  /**
   * Splits a sentence into an array of single words
   */
  const splitIntoWords = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* German Flag Header & Speaker Button */}
        <View style={styles.header}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageBadgeText}>🇩🇪 German</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleSpeak(germanText, 'de')}
            style={styles.speakButton}
          >
            <Ionicons 
              name={speaking ? 'volume-high' : 'volume-medium'} 
              size={24} 
              color="#2c6b3f" 
            />
          </TouchableOpacity>
        </View>

        {/* Main German Translated String */}
        <Text style={styles.germanMainText}>{germanText}</Text>

        {/* Interactive Word Breakdown Pills */}
        <Text style={styles.wordSectionTitle}>Tap word to listen:</Text>
        <View style={styles.wordsWrapper}>
          {splitIntoWords(germanText).map((word, wordIndex) => {
            // Strip punctuation for speech synthesis
            const cleanWord = word.replace(/[^a-zA-ZäöüßÄÖÜ]/g, '');
            return (
              <TouchableOpacity
                key={`word-${wordIndex}`}
                onPress={() => speakText(cleanWord || word, 'de')}
                style={styles.wordPill}
              >
                <Text style={styles.wordPillText}>{word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Visual Divider Line */}
        <View style={styles.divider} />

        {/* English Flag Header & Speaker Button */}
        <View style={styles.header}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageBadgeText}>🇬🇧 English</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleSpeak(englishText, 'en')}
            style={styles.speakButton}
          >
            <Ionicons name="volume-medium" size={24} color="#2c6b3f" />
          </TouchableOpacity>
        </View>

        {/* English Result Text */}
        <Text style={styles.englishText}>{englishText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  languageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c6b3f',
  },
  speakButton: {
    padding: 6,
  },
  germanMainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 28,
    marginBottom: 12,
  },
  wordSectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
    marginBottom: 6,
  },
  wordsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  wordPill: {
    backgroundColor: '#f0f7f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  wordPillText: {
    fontSize: 14,
    color: '#2c6b3f',
    fontWeight: '500',
  },
  englishText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 14,
  },
});

export default TranslationCard;