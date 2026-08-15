/**
 * Sentence Component (Sentence.tsx)
 * ---------------------------------
 * Component card for full German sentences in the vocabulary review tab.
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

interface SentenceProps {
  german: string;
  english: string;
}

const Sentence: React.FC<SentenceProps> = ({ german, english }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speakSentence = () => {
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
          rate: 0.75,
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

  const handleCopy = () => {
    Alert.alert('Copied', `"${german} = ${english}" copied!`);
  };

  const wordCount = german.trim().split(/\s+/).length;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.germanText} numberOfLines={isExpanded ? undefined : 1}>
            🇩🇪 {german}
          </Text>
          <TouchableOpacity onPress={speakSentence} style={styles.speakButton}>
            <Ionicons
              name={speaking ? 'volume-high' : 'volume-medium'}
              size={20}
              color="#2c6b3f"
            />
          </TouchableOpacity>
        </View>

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

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.englishText}>🇬🇧 {english}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Sentence</Text>
            </View>
            <View style={[styles.tag, styles.wordCountTag]}>
              <Text style={[styles.tagText, styles.wordCountText]}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

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
  sentenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  germanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
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
    fontSize: 15,
    color: '#475569',
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
    marginRight: 6,
  },
  wordCountTag: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  tagText: {
    fontSize: 12,
    color: '#2c6b3f',
    fontWeight: '600',
  },
  wordCountText: {
    color: '#475569',
  },
});

export default Sentence;
