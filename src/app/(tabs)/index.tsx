/**
 * TranslatorScreen Component ((tabs)/index.tsx)
 * --------------------------------------------
 * Main Screen for Deutsch2 where users type text and receive translations in German or English.
 * 
 * Features:
 * 1. Image OCR Text Extraction via camera or gallery.
 * 2. Direction toggle (German → English ⇄ English → German).
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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GermanInput from '../components/GermanInput';
import TranslationCard from '../components/TranslationCard';
import { translateText } from '../services/translator';
import { pickImage, extractTextFromImage } from '../services/ocr';
import { saveTranslation } from '../storage/historyStorage';

export default function TranslatorScreen() {
  // State: holds the text entered by the user
  const [inputText, setInputText] = useState('');
  
  // State: holds the resulting translation
  const [translatedText, setTranslatedText] = useState('');
  
  // State: tracks translation direction: 'de-en' (German -> English) or 'en-de' (English -> German)
  const [direction, setDirection] = useState<'de-en' | 'en-de'>('de-en');

  // State: tracks whether a translation API call is currently in progress
  const [isLoading, setIsLoading] = useState(false);

  // State: tracks whether an image OCR scan is in progress
  const [isScanning, setIsScanning] = useState(false);

  const sourceLang = direction === 'de-en' ? 'de' : 'en';
  const targetLang = direction === 'de-en' ? 'en' : 'de';
  const ocrLang = sourceLang === 'de' ? 'ger' : 'eng';

  /**
   * Swaps translation direction and swaps input/output text
   */
  const handleSwapLanguages = () => {
    setDirection((prev) => (prev === 'de-en' ? 'en-de' : 'de-en'));
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  /**
   * Prompts source options or launches OCR image text extraction directly
   */
  const handleScanImage = (source?: 'camera' | 'library') => {
    if (source) {
      executeScan(source);
    } else {
      Alert.alert(
        'Scan Text from Image',
        'Choose an image source to extract text:',
        [
          { text: 'Take Photo', onPress: () => executeScan('camera') },
          { text: 'Choose from Gallery', onPress: () => executeScan('library') },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  const executeScan = async (source: 'camera' | 'library') => {
    try {
      setIsScanning(true);
      const image = await pickImage(source);
      if (!image) return; // User cancelled image selection

      const text = await extractTextFromImage(image.base64, ocrLang);
      if (!text) {
        Alert.alert('No text found', 'Could not detect any text in that image.');
        return;
      }

      setInputText(text);
      setTranslatedText('');
    } catch (error: any) {
      console.error('OCR error:', error);
      Alert.alert('Error', error.message || 'Failed to extract text from image.');
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Triggers translation process when user presses "Translate" button
   */
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Notice', `Please enter ${sourceLang === 'de' ? 'German' : 'English'} text to translate.`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);

      // Persist successful translation in AsyncStorage history
      await saveTranslation({
        german: sourceLang === 'de' ? inputText.trim() : result,
        english: sourceLang === 'de' ? result : inputText.trim(),
        direction,
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
        {/* Header Title & Direction Switcher Section */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>
              {direction === 'de-en' ? 'German → English' : 'English → German'}
            </Text>
            <TouchableOpacity 
              style={styles.swapButton}
              onPress={handleSwapLanguages}
              accessibilityLabel="Swap translation direction"
            >
              <Ionicons name="swap-horizontal" size={20} color="#2c6b3f" />
              <Text style={styles.swapButtonText}>Swap</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {direction === 'de-en'
              ? 'Translate German words, sentences, or phrases'
              : 'Translate English words, sentences, or phrases'}
          </Text>
        </View>

        {/* Input box component with built-in camera scan trigger */}
        <GermanInput
          value={inputText}
          onChangeText={(text: string) => {
            setInputText(text);
            if (!text) setTranslatedText('');
          }}
          onTranslate={handleTranslate}
          onScan={() => handleScanImage()}
          isLoading={isLoading || isScanning}
          placeholder={
            direction === 'de-en'
              ? 'Enter German text (e.g., Guten Morgen, Haus...)'
              : 'Enter English text (e.g., Good morning, House...)'
          }
        />

        {/* Result Card: Displayed only when translation result exists */}
        {translatedText ? (
          <TranslationCard 
            germanText={sourceLang === 'de' ? inputText : translatedText} 
            englishText={sourceLang === 'de' ? translatedText : inputText}
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c6b3f', // Forest green theme
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  swapButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c6b3f',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
});
