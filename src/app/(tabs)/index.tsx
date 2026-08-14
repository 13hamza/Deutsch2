/**
 * TranslatorScreen Component ((tabs)/index.tsx)
 * --------------------------------------------
 * Main Screen for Deutsch2 where users type German text and receive English translations.
 * 
 * Beginners Guide:
 * 1. useState: React Hook to manage state variables (inputText, translatedText, isLoading).
 * 2. translateText: Service function that fetches translation from external APIs (or local dictionary).
 * 3. saveTranslation: Service function that saves translated items into AsyncStorage history.
 * 4. KeyboardAvoidingView: Prevents the mobile on-screen keyboard from covering input text fields.
 * 5. GermanInput & TranslationCard: Custom components for user input and displaying results.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import GermanInput from '../components/GermanInput';
import TranslationCard from '../components/TranslationCard';
import { translateText } from '../services/translator';
import { saveTranslation } from '../storage/historyStorage';

export default function TranslatorScreen() {
  // State: holds the German text entered by the user
  const [inputText, setInputText] = useState('');
  
  // State: holds the resulting English translation
  const [translatedText, setTranslatedText] = useState('');
  
  // State: tracks whether a translation API call is currently in progress
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Triggers translation process when user presses "Translate" button
   */
  const handleTranslate = async () => {
    // Input validation: ensure text is not empty
    if (!inputText.trim()) {
      Alert.alert('Notice', 'Please enter German text to translate.');
      return;
    }

    // Set loading indicator to true while fetching translation
    setIsLoading(true);
    try {
      // Call translation service function
      const result = await translateText(inputText);
      setTranslatedText(result);

      // Persist successful translation in AsyncStorage history
      await saveTranslation({
        german: inputText.trim(),
        english: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Failed to translate. Please try again.');
    } finally {
      // Hide loading spinner regardless of success or failure
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      // Adjust view height on iOS when keyboard appears
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Title Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>German Translator</Text>
          <Text style={styles.headerSubtitle}>Translate German words, sentences, or phrases</Text>
        </View>

        {/* Input box component for typing German text */}
        <GermanInput
          value={inputText}
          onChangeText={(text: string) => {
            setInputText(text);
            // Clear translation card when user clears text box
            if (!text) setTranslatedText('');
          }}
          onTranslate={handleTranslate}
          isLoading={isLoading}
          placeholder="Enter German text (e.g., Guten Morgen, Haus...)"
        />

        {/* Result Card: Displayed only when translation result exists */}
        {translatedText ? (
          <TranslationCard 
            germanText={inputText} 
            englishText={translatedText}
          />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Visual styling for translator screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5', // Soft light gray-green background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c6b3f', // Forest green theme
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
});
