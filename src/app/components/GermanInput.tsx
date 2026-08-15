/**
 * GermanInput Component (GermanInput.tsx)
 * --------------------------------------
 * Multiline text input component with quick suggestion chips,
 * clear action, image OCR trigger, and copy option.
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GermanInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  placeholder?: string;
  onScan?: () => void;
  sourceLang?: 'de' | 'en';
}

const SAMPLE_GERMAN_PHRASES = [
  'Guten Morgen',
  'Wie geht es dir?',
  'Danke schön',
  'Wo ist die Toilette?',
  'Ich hätte gerne ein Wasser',
];

const SAMPLE_ENGLISH_PHRASES = [
  'Good morning',
  'How are you?',
  'Thank you very much',
  'Where is the bathroom?',
  'I would like a water',
];

const GermanInput: React.FC<GermanInputProps> = ({
  value,
  onChangeText,
  onTranslate,
  isLoading,
  placeholder,
  onScan,
  sourceLang = 'de',
}) => {
  const suggestions = sourceLang === 'de' ? SAMPLE_GERMAN_PHRASES : SAMPLE_ENGLISH_PHRASES;

  return (
    <View style={styles.container}>
      {/* Input container wrapper */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Enter text to translate...'}
          placeholderTextColor="#90a4ae"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={1000}
        />
        {/* Action icons bar inside input container */}
        <View style={styles.topRightIcons}>
          {onScan && (
            <TouchableOpacity
              onPress={onScan}
              style={styles.iconButton}
              accessibilityLabel="Scan text from image"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="camera-outline" size={22} color="#2c6b3f" />
            </TouchableOpacity>
          )}
          {value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText('')}
              style={styles.iconButton}
              accessibilityLabel="Clear input text"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={22} color="#90a4ae" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Footer bar with character count */}
      {value.length > 0 && (
        <View style={styles.footerRow}>
          <Text style={styles.charCount}>{value.length} / 1000</Text>
        </View>
      )}

      {/* Quick sample suggestion chips when input is empty */}
      {value.length === 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick Suggestions:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {suggestions.map((phrase, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => onChangeText(phrase)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipText}>{phrase}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Translate Button */}
      <TouchableOpacity
        style={[styles.translateButton, isLoading && styles.disabledButton]}
        onPress={onTranslate}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isLoading ? 'sync-outline' : 'arrow-forward'}
          size={20}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          {isLoading ? 'Translating...' : 'Translate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#1b4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    minHeight: 110,
    paddingRight: 70,
    color: '#1e293b',
    lineHeight: 24,
  },
  topRightIcons: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  suggestionsContainer: {
    marginTop: 10,
    marginBottom: 4,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    color: '#2c6b3f',
    fontWeight: '500',
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c6b3f',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default GermanInput;
