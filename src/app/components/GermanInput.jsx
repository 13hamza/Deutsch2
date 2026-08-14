// src/components/GermanInput.jsx
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
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
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder || "Enter German text..."}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {value.length > 0 && (
          <TouchableOpacity 
            onPress={() => onChangeText('')} 
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.translateButton, isLoading && styles.disabledButton]}
        onPress={onTranslate}
        disabled={isLoading}
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