// src/components/HistoryItem.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const HistoryItem = ({ item, onDelete }) => {
  const speakText = (text, language) => {
    Speech.speak(text, {
      language: language === 'de' ? 'de' : 'en',
      pitch: 1,
      rate: 0.8,
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => speakText(item.german, 'de')}
            style={styles.textRow}
          >
            <Text style={styles.germanText}>🇩🇪 {item.german}</Text>
            <Ionicons name="volume-medium" size={18} color="#2c6b3f" />
          </TouchableOpacity>
          <View style={styles.textRow}>
            <Text style={styles.englishText}>🇬🇧 {item.english}</Text>
            <TouchableOpacity
              onPress={() => speakText(item.english, 'en')}
              style={styles.speakIcon}
            >
              <Ionicons name="volume-low" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.metadata}>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  germanText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  englishText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  speakIcon: {
    marginLeft: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
});

export default HistoryItem;