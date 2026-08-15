/**
 * HistoryItem Component (HistoryItem.tsx)
 * ---------------------------------------
 * Row card component rendering a single saved translation entry.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { HistoryItemType } from '../types';
import { getRelativeTime } from '../utils/dateUtils';

interface HistoryItemProps {
  item: HistoryItemType;
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  const speakText = (text: string, language: 'de' | 'en') => {
    try {
      Speech.speak(text, {
        language: language === 'de' ? 'de' : 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  const handleCopy = (text: string) => {
    Alert.alert('Copied to Clipboard', `"${text}" copied!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* German & English text rows */}
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => speakText(item.german, 'de')}
            style={styles.textRow}
            activeOpacity={0.7}
          >
            <Text style={styles.germanText}>🇩🇪 {item.german}</Text>
            <Ionicons name="volume-medium" size={18} color="#2c6b3f" style={styles.speakIcon} />
          </TouchableOpacity>
          
          <View style={styles.textRow}>
            <Text style={styles.englishText}>🇬🇧 {item.english}</Text>
            <TouchableOpacity
              onPress={() => speakText(item.english, 'en')}
              style={styles.speakIconBtn}
            >
              <Ionicons name="volume-low" size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Metadata, Copy & Delete Actions */}
        <View style={styles.metadata}>
          <Text style={styles.directionText}>
            {item.direction === 'en-de' ? 'EN→DE' : 'DE→EN'}
          </Text>
          <Text style={styles.timeText}>{getRelativeTime(item.timestamp)}</Text>

          <TouchableOpacity
            onPress={() => handleCopy(`${item.german} = ${item.english}`)}
            style={styles.actionBtn}
            accessibilityLabel="Copy item text"
          >
            <Ionicons name="copy-outline" size={18} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={styles.actionBtn}
            accessibilityLabel="Delete item"
          >
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  content: {
    flexDirection: 'column',
  },
  textContainer: {
    marginBottom: 8,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  germanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  englishText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  speakIcon: {
    marginLeft: 6,
  },
  speakIconBtn: {
    padding: 2,
    marginLeft: 6,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  directionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2c6b3f',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
    flex: 1,
    marginLeft: 10,
  },
  actionBtn: {
    padding: 4,
    marginLeft: 10,
  },
});

export default HistoryItem;
