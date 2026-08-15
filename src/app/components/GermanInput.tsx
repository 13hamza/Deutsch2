/**
 * GermanInput Component (GermanInput.tsx)
 * --------------------------------------
 * Beginner Guide:
 * This component handles user text input.
 * It features:
 * - A multiline `<TextInput>` for typing words or long sentences.
 * - Action buttons inside the input box (Camera OCR scan button and Clear 'X' button).
 * - Quick suggestion chips for fast testing when the input box is empty.
 * - A character counter showing typed character length.
 * - A "Translate" action button that triggers the translation process.
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

// Props Interface: Defines all properties passed into this component from parent views
interface GermanInputProps {
  /** Current text string inside the input field */
  value: string;
  /** Callback function invoked whenever text is typed or cleared */
  onChangeText: (text: string) => void;
  /** Callback function invoked when user taps the "Translate" button */
  onTranslate: () => void;
  /** Boolean indicating if translation or OCR scan is currently in progress */
  isLoading: boolean;
  /** Placeholder hint text shown inside input field when empty */
  placeholder?: string;
  /** Optional callback function to launch camera/gallery OCR scan */
  onScan?: () => void;
  /** Current active language mode ('de' for German source, 'en' for English source) */
  sourceLang?: 'de' | 'en';
}

// Sample German phrase quick suggestions
const SAMPLE_GERMAN_PHRASES = [
  'Guten Morgen',
  'Wie geht es dir?',
  'Danke schön',
  'Wo ist die Toilette?',
  'Ich hätte gerne ein Wasser',
];

// Sample English phrase quick suggestions
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
  // Select sample suggestions list based on active source language
  const suggestions = sourceLang === 'de' ? SAMPLE_GERMAN_PHRASES : SAMPLE_ENGLISH_PHRASES;

  return (
    <View style={styles.container}>
      {/* Input container wrapper with relative positioning */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || 'Enter text to translate...'}
          placeholderTextColor="#90a4ae"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top" // Aligns text to top of box on Android devices
          maxLength={1000}       // Caps input text length at 1000 characters
        />
        
        {/* Top-right action icon buttons inside input box */}
        <View style={styles.topRightIcons}>
          {/* Camera Scan Button (Visible if onScan prop is provided) */}
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

          {/* Clear text 'X' Button (Visible only when user has typed text) */}
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

      {/* Footer row displaying live character count when text is present */}
      {value.length > 0 && (
        <View style={styles.footerRow}>
          <Text style={styles.charCount}>{value.length} / 1000</Text>
        </View>
      )}

      {/* Quick sample suggestion chips rendered when input box is empty */}
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

      {/* Main Translate Button */}
      <TouchableOpacity
        style={[styles.translateButton, isLoading && styles.disabledButton]}
        onPress={onTranslate}
        disabled={isLoading} // Disables press interactions while loading
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

// Component Visual Stylesheet
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
