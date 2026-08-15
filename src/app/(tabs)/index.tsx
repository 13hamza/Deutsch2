/**
 * TranslatorScreen Component ((tabs)/index.tsx)
 * --------------------------------------------
 * Main Screen for Deutsch2: Instant German <-> English text translation,
 * speech synthesis, and OCR text extraction from images/camera.
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
import { TranslationDirection } from '../types';

export default function TranslatorScreen() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [direction, setDirection] = useState<TranslationDirection>('de-en');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const sourceLang = direction === 'de-en' ? 'de' : 'en';
  const targetLang = direction === 'de-en' ? 'en' : 'de';
  const ocrLang = sourceLang === 'de' ? 'ger' : 'eng';

  /**
   * Swaps translation direction and input/output text
   */
  const handleSwapLanguages = () => {
    setDirection((prev) => (prev === 'de-en' ? 'en-de' : 'de-en'));
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  /**
   * Prompts user for camera or gallery input
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
      if (!image) return;

      const text = await extractTextFromImage(image.base64, ocrLang);
      if (!text) {
        Alert.alert('No text found', 'Could not detect any text in that image.');
        return;
      }

      setInputText(text);
      setTranslatedText('');
    } catch (error: any) {
      console.error('OCR error:', error);
      Alert.alert('Scan Failed', error?.message || 'Failed to extract text from image.');
    } finally {
      setIsScanning(false);
    }
  };

  /**
   * Triggers translation
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

      // Save translation in local history storage
      await saveTranslation({
        german: sourceLang === 'de' ? inputText.trim() : result,
        english: sourceLang === 'de' ? result : inputText.trim(),
        direction,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
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
        {/* Header Title & Direction Switcher */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>
              {direction === 'de-en' ? '🇩🇪 German → 🇬🇧 English' : '🇬🇧 English → 🇩🇪 German'}
            </Text>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLanguages}
              accessibilityLabel="Swap translation direction"
              activeOpacity={0.7}
            >
              <Ionicons name="swap-horizontal" size={18} color="#2c6b3f" />
              <Text style={styles.swapButtonText}>Swap</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            {direction === 'de-en'
              ? 'Translate German words, sentences, or phrases'
              : 'Translate English words, sentences, or phrases'}
          </Text>
        </View>

        {/* Multiline Input Box with OCR scan & Quick suggestions */}
        <GermanInput
          value={inputText}
          onChangeText={(text: string) => {
            setInputText(text);
            if (!text) setTranslatedText('');
          }}
          onTranslate={handleTranslate}
          onScan={() => handleScanImage()}
          isLoading={isLoading || isScanning}
          sourceLang={sourceLang}
          placeholder={
            direction === 'de-en'
              ? 'Enter German text (e.g. Guten Morgen, Haus...)'
              : 'Enter English text (e.g. Good morning, House...)'
          }
        />

        {/* Translation Result Card */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1b4332',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  swapButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c6b3f',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
  },
});
