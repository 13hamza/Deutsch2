// src/app/components/TranslationCard.jsx
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
  const [speaking, setSpeaking] = useState(false);

  const speakText = (text, language) => {
    const options = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1,
      rate: 0.8,
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

  const stopSpeaking = () => {
    try {
      Speech.stop();
    } catch (e) {}
    setSpeaking(false);
  };

  const handleSpeak = (text, language) => {
    if (speaking) {
      stopSpeaking();
    } else {
      speakText(text, language);
    }
  };

  const splitIntoWords = (text) => {
    return text.split(/\s+/).filter(word => word.length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* German Section */}
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

        <Text style={styles.germanMainText}>{germanText}</Text>

        <Text style={styles.wordSectionTitle}>Tap word to listen:</Text>
        <View style={styles.wordsWrapper}>
          {splitIntoWords(germanText).map((word, wordIndex) => {
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

        <View style={styles.divider} />

        {/* English Section */}
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