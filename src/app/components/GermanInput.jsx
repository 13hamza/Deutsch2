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
}) => {
  return (
    <View style={styles.container}>
      {/* Input container with relative positioning for absolute clear icon */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || "Enter German text..."}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top" // Aligns text to top of box on Android
        />
        {/* Quick clear (X) icon appears only when input has text */}
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={() => onChangeText('')} 
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        )}
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
    paddingRight: 40,
    color: '#333',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
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