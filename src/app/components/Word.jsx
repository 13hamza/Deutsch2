// src/components/Word.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const Word = ({ german, english }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speakWord = () => {
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
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#999" 
        />
      </View>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.englishText}>{english}</Text>
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
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  englishText: {
    fontSize: 16,
    color: '#333',
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
  },
  tagText: {
    fontSize: 12,
    color: '#2c6b3f',
    fontWeight: '500',
  },
});

export default Word;