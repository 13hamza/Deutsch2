/**
 * HistoryItem Component (HistoryItem.tsx)
 * ---------------------------------------
 * Beginner Guide:
 * Represents a single list row item in the History screen.
 * Displays:
 * - German & English translation pair.
 * - Direction badge tag (`DE→EN` or `EN→DE`).
 * - Human-readable relative timestamp (e.g. "Just now", "5m ago").
 * - Text-To-Speech pronunciation audio trigger.
 * - Quick copy & delete action buttons.
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

// Props Interface for HistoryItem
interface HistoryItemProps {
  /** The saved history record object */
  item: HistoryItemType;
  /** Callback function triggered when user taps the trash/delete icon */
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  /**
   * Speaks text out loud in German ('de') or English ('en')
   */
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

  /**
   * Copies translation pair text to device clipboard with user feedback alert
   */
  const handleCopy = (text: string) => {
    Alert.alert('Copied to Clipboard', `"${text}" copied!`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* German & English text rows */}
        <View style={styles.textContainer}>
          {/* German text row with audio speaker icon */}
          <TouchableOpacity
            onPress={() => speakText(item.german, 'de')}
            style={styles.textRow}
            activeOpacity={0.7}
          >
            <Text style={styles.germanText}>🇩🇪 {item.german}</Text>
            <Ionicons name="volume-medium" size={18} color="#2c6b3f" style={styles.speakIcon} />
          </TouchableOpacity>

          {/* English translation row with audio speaker icon */}
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

        {/* Card Footer Metadata, Copy & Delete Actions */}
        <View style={styles.metadata}>
          {/* Direction Tag Badge (DE→EN or EN→DE) */}
          <Text style={styles.directionText}>
            {item.direction === 'en-de' ? 'EN→DE' : 'DE→EN'}
          </Text>

          {/* Relative Timestamp (e.g., "5m ago") */}
          <Text style={styles.timeText}>{getRelativeTime(item.timestamp)}</Text>

          {/* Copy Action Button */}
          <TouchableOpacity
            onPress={() => handleCopy(`${item.german} = ${item.english}`)}
            style={styles.actionBtn}
            accessibilityLabel="Copy item text"
          >
            <Ionicons name="copy-outline" size={18} color="#64748b" />
          </TouchableOpacity>

          {/* Delete Action Button */}
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

// Component Visual Stylesheet
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
