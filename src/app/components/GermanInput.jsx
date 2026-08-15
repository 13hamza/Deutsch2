/**
 * GermanInput Component (GermanInput.jsx)
 * --------------------------------------
 * Reusable multiline text input component with clear button and action button.
 * 
 * Beginners Guide:
 * 1. Props:
 *    - `value`: Current text string inside input box.
 *    - `onChangeText`: Callback function triggered when user types or deletes text.
 *    - `onTranslate`: Function triggered when user taps the "Translate" button.
 *    - `isLoading`: Boolean to show loading spinner state.
 *    - `placeholder`: Hint text shown when input box is empty.
 * 2. TextInput: Native component allowing multi-line text input.
 * 3. TouchableOpacity: Button wrapper that provides smooth touch feedback opacity when tapped.
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GermanInput = ({ 
  value, 
  onChangeText, 
  onTranslate, 
  isLoading,
  placeholder,
  onScan,
}) => {
  return (
    <View style={styles.container}>
      {/* Input container with relative positioning for absolute top-right icons */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            { paddingRight: (onScan ? 36 : 0) + (value.length > 0 ? 36 : 0) + 12 },
          ]}
          placeholder={placeholder || "Enter text..."}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top" // Aligns text to top of box on Android
        />
        {/* Top-right action icons: Camera/Scan and Clear (X) */}
        <View style={styles.topRightIcons}>
          {onScan && (
            <TouchableOpacity 
              onPress={onScan} 
              style={styles.iconButton}
              accessibilityLabel="Scan text from image"
            >
              <Ionicons name="camera-outline" size={22} color="#2c6b3f" />
            </TouchableOpacity>
          )}
          {value.length > 0 && (
            <TouchableOpacity 
              onPress={() => onChangeText('')} 
              style={styles.iconButton}
              accessibilityLabel="Clear input text"
            >
              <Ionicons name="close-circle" size={22} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Action Translate Button */}
      <TouchableOpacity
        style={[styles.translateButton, isLoading && styles.disabledButton]}
        onPress={onTranslate}
        disabled={isLoading} // Disable button interaction while loading
      >
        <Ionicons name="arrow-forward" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {isLoading ? 'Translating...' : 'Translate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    // Drop shadow styling for iOS & Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    paddingRight: 70,
    color: '#333',
  },
  topRightIcons: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c6b3f',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default GermanInput;