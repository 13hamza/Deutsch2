/**
 * TranslationCard Component (TranslationCard.tsx)
 * ----------------------------------------------
 * Beginner Guide:
 * Displays the translation result card.
 * Features:
 * - German & English flag badges (🇩🇪 German, 🇬🇧 English).
 * - Text-To-Speech (TTS) audio speaker buttons for both languages.
 * - Interactive Word Pills: Automatically breaks German sentences into clickable word chips so learners can tap a single word to hear its pronunciation!
 * - One-tap Copy to Clipboard button with instant visual feedback alert.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

// Props Interface: Expected input props for TranslationCard
interface TranslationCardProps {
  /** The German text phrase */
  germanText: string;
  /** The English text translation */
  englishText: string;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ germanText, englishText }) => {
  // State: Tracks active audio speech language ('de', 'en', or null when stopped)
  const [speakingLang, setSpeakingLang] = useState<'de' | 'en' | null>(null);
  
  // State: Tracks copied label ('de' or 'en') for instant visual feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  /**
   * Speaks target text out loud using native Text-To-Speech engine.
   * If speech is already playing, tapping the button halts playback.
   */
  const speakText = (text: string, language: 'de' | 'en') => {
    // If speaking, stop playback
    if (speakingLang) {
      try {
        Speech.stop();
      } catch {
        // Ignore error
      }
      setSpeakingLang(null);
      return;
    }

    // Configure options for speech synthesis
    const options: Speech.SpeechOptions = {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1.0,
      rate: 0.8, // Slightly lower speed for clear pronunciation learning
      onStart: () => setSpeakingLang(language),
      onDone: () => setSpeakingLang(null),
      onError: () => setSpeakingLang(null),
    };

    try {
      Speech.speak(text, options);
    } catch (e) {
      console.warn('Speech error:', e);
      setSpeakingLang(null);
    }
  };

  /**
   * Triggers a user alert indicating text has been copied.
   */
  const handleCopy = (text: string, label: string) => {
    setCopiedText(label);
    Alert.alert('Copied to Clipboard', `"${text}" copied!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  /**
   * Helper function: Splits a full sentence into an array of individual words.
   * Example: "Guten Morgen Welt" -> ["Guten", "Morgen", "Welt"]
   */
  const splitIntoWords = (text: string): string[] => {
    return text.split(/\s+/).filter((word) => word.length > 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* German Section Header: Flag Badge & Action Buttons */}
        <View style={styles.header}>
          <View style={styles.languageBadge}>
            <Text style={styles.languageBadgeText}>🇩🇪 German</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Copy German Text Action Button */}
            <TouchableOpacity
              onPress={() => handleCopy(germanText, 'de')}
              style={styles.actionIconButton}
              accessibilityLabel="Copy German text"
            >
              <Ionicons
                name={copiedText === 'de' ? 'checkmark' : 'copy-outline'}
                size={18}
                color={copiedText === 'de' ? '#2c6b3f' : '#64748b'}
              />
            </TouchableOpacity>

            {/* Listen to German TTS Action Button */}
            <TouchableOpacity
              onPress={() => speakText(germanText, 'de')}
              style={styles.actionIconButton}
              accessibilityLabel="Listen to German pronunciation"
            >
              <Ionicons
                name={speakingLang === 'de' ? 'volume-high' : 'volume-medium'}
                size={22}
                color="#2c6b3f"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main German Translated Text */}
        <Text style={styles.germanMainText}>{germanText}</Text>

        {/* Interactive Word Breakdown Pills */}
        <Text style={styles.wordSectionTitle}>Tap any word to pronounce:</Text>
        <View style={styles.wordsWrapper}>
          {splitIntoWords(germanText).map((word, wordIndex) => {
            // Strip punctuation marks (commas, periods, question marks) for accurate speech synthesis
            const cleanWord = word.replace(/[^a-zA-ZäöüßÄÖÜ]/g, '');
            return (
              <TouchableOpacity
                key={`word-${wordIndex}`}
                onPress={() => speakText(cleanWord || word, 'de')}
                style={styles.wordPill}
                activeOpacity={0.7}
              >
                <Text style={styles.wordPillText}>{word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Card Divider Line */}
        <View style={styles.divider} />

        {/* English Section Header: Flag Badge & Action Buttons */}
        <View style={styles.header}>
          <View style={[styles.languageBadge, styles.englishBadge]}>
            <Text style={styles.englishBadgeText}>🇬🇧 English</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Copy English Translation Action Button */}
            <TouchableOpacity
              onPress={() => handleCopy(englishText, 'en')}
              style={styles.actionIconButton}
              accessibilityLabel="Copy English translation"
            >
              <Ionicons
                name={copiedText === 'en' ? 'checkmark' : 'copy-outline'}
                size={18}
                color={copiedText === 'en' ? '#2c6b3f' : '#64748b'}
              />
            </TouchableOpacity>

            {/* Listen to English TTS Action Button */}
            <TouchableOpacity
              onPress={() => speakText(englishText, 'en')}
              style={styles.actionIconButton}
              accessibilityLabel="Listen to English translation"
            >
              <Ionicons
                name={speakingLang === 'en' ? 'volume-high' : 'volume-medium'}
                size={22}
                color="#2c6b3f"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* English Translated Text Result */}
        <Text style={styles.englishText}>{englishText}</Text>
      </View>
    </View>
  );
};

// Component Visual Stylesheet
const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1b4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    padding: 6,
    marginLeft: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  languageBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  languageBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c6b3f',
  },
  englishBadge: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  englishBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  germanMainText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 12,
  },
  wordSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  wordsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  wordPill: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
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
    color: '#334155',
    lineHeight: 26,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
});

export default TranslationCard;
