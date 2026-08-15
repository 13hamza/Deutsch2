/**
 * Word Component (Word.tsx)
 * -------------------------
 * Beginner Guide:
 * Flashcard-style expandable card component for single German words in the Review screen.
 * Tapping the card toggles the `isExpanded` state to reveal/hide the English translation.
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

// Expected props for Word component
interface WordProps {
  /** The German single word */
  german: string;
  /** The English translation string */
  english: string;
}

const Word: React.FC<WordProps> = ({ german, english }) => {
  // State: Controls whether the flashcard is expanded to reveal translation
  const [isExpanded, setIsExpanded] = useState(false);
  
  // State: Tracks whether speech synthesis is actively reading out the word
  const [speaking, setSpeaking] = useState(false);

  /**
   * Speaks German word aloud using TTS
   */
  const speakWord = () => {
    if (speaking) {
      try {
        Speech.stop();
      } catch {}
      setSpeaking(false);
    } else {
      try {
        Speech.speak(german, {
          language: 'de',
          pitch: 1.0,
          rate: 0.7,
          onStart: () => setSpeaking(true),
          onDone: () => setSpeaking(false),
          onError: () => setSpeaking(false),
        });
      } catch (e) {
        console.warn('Speech error:', e);
        setSpeaking(false);
      }
    }
  };

  /**
   * Copies word translation pair to clipboard with alert notice
   */
  const handleCopy = () => {
    Alert.alert('Copied', `"${german} = ${english}" copied!`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.8}
    >
      {/* Header Row: German Word & Speaker Icon */}
      <View style={styles.header}>
        <View style={styles.wordContainer}>
          <Text style={styles.germanText}>{german}</Text>
          <TouchableOpacity onPress={speakWord} style={styles.speakButton}>
            <Ionicons
              name={speaking ? 'volume-high' : 'volume-medium'}
              size={20}
              color="#2c6b3f"
            />
          </TouchableOpacity>
        </View>

        {/* Right Actions: Copy & Expand Arrow Indicator */}
        <View style={styles.rightHeaderActions}>
          <TouchableOpacity onPress={handleCopy} style={styles.iconBtn}>
            <Ionicons name="copy-outline" size={18} color="#94a3b8" />
          </TouchableOpacity>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#94a3b8"
            style={{ marginLeft: 6 }}
          />
        </View>
      </View>

      {/* Expanded Content: Visible only when `isExpanded === true` */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.englishText}>🇬🇧 {english}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Word</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Visual Stylesheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  germanText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c6b3f',
    marginRight: 8,
  },
  speakButton: {
    padding: 4,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
  },
  rightHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 4,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  englishText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  tagText: {
    fontSize: 12,
    color: '#2c6b3f',
    fontWeight: '600',
  },
});

export default Word;
