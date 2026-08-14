// src/app/(tabs)/index.tsx
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
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Notice', 'Please enter German text to translate.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(inputText);
      setTranslatedText(result);

      // Save to AsyncStorage history
      await saveTranslation({
        german: inputText.trim(),
        english: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Failed to translate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>German Translator</Text>
          <Text style={styles.headerSubtitle}>Translate German words, sentences, or phrases</Text>
        </View>

        <GermanInput
          value={inputText}
          onChangeText={(text: string) => {
            setInputText(text);
            if (!text) setTranslatedText('');
          }}
          onTranslate={handleTranslate}
          isLoading={isLoading}
          placeholder="Enter German text (e.g., Guten Morgen, Haus...)"
        />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
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
    color: '#2c6b3f',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
});
