/**
 * Sentence Component (Sentence.jsx)
 * ---------------------------------
 * Component card for full German sentences in the review collection.
 * 
 * Beginners Guide:
 * 1. Sentence display: Displays a full sentence with word count metrics.
 * 2. Interactive Expansion: Tapping reveals full English sentence translation.
 * 3. Audio TTS: Speaker icon pronounces the whole German sentence.
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

const Sentence = ({ german, english }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  /**
   * Speaks full German sentence
   */
  const speakSentence = () => {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
    } else {
      Speech.speak(german, {
        language: 'de',
        pitch: 1,
        rate: 0.7,
        onStart: () => setSpeaking(true),
        onDone: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.germanText} numberOfLines={1}>
            {german}
          </Text>
          <TouchableOpacity onPress={speakSentence} style={styles.speakButton}>
            <Ionicons 
              name={speaking ? 'volume-high' : 'volume-medium'} 
              size={20} 
              color="#2c6b3f" 
            />
          </TouchableOpacity>
        </View>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#999" 
        />
      </View>
      
      {/* Expanded view showing English translation and word count tag */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.englishText}>{english}</Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Sentence</Text>
            </View>
            <View style={[styles.tag, styles.wordCountTag]}>
              <Text style={styles.tagText}>
                {german.split(' ').length} words
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  speakButton: {
    padding: 4,
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  englishText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  wordCountTag: {
    backgroundColor: '#e3f2fd',
  },
  tagText: {
    fontSize: 12,
    color: '#2c6b3f',
    fontWeight: '500',
  },
});

export default Sentence;