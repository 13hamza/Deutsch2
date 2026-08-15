/**
 * TranslatorScreen Component ((tabs)/index.tsx)
 * --------------------------------------------
 * Beginner Guide:
 * This is the main screen of the application where users type German or English text
 * and receive real-time translations.
 * 
 * Features Breakdown:
 * 1. State Management:
 *    - `inputText`: Holds the user's typed text string.
 *    - `translatedText`: Holds the output translated string.
 *    - `direction`: Toggles between German -> English ('de-en') and English -> German ('en-de').
 *    - `isLoading` & `isScanning`: Control loading spinner feedback states.
 * 2. Swapping Direction: Swapping language directions automatically flips input and result text.
 * 3. Image OCR Text Extraction: Captures/picks an image and extracts printed text into the input box.
 * 4. Persistence: Automatically saves every successful translation to local device history storage.
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
  // State: Holds user input text string
  const [inputText, setInputText] = useState('');

  // State: Holds generated translation result string
  const [translatedText, setTranslatedText] = useState('');

  // State: Controls translation direction ('de-en' or 'en-de')
  const [direction, setDirection] = useState<TranslationDirection>('de-en');

  // State: Tracks active translation API call
  const [isLoading, setIsLoading] = useState(false);

  // State: Tracks active image OCR scan processing
  const [isScanning, setIsScanning] = useState(false);

  // Computed language variables based on active direction
  const sourceLang = direction === 'de-en' ? 'de' : 'en';
  const targetLang = direction === 'de-en' ? 'en' : 'de';
  const ocrLang = sourceLang === 'de' ? 'ger' : 'eng';

  /**
   * Swaps translation direction ('de-en' <-> 'en-de')
   * and automatically swaps input and output text strings.
   */
  const handleSwapLanguages = () => {
    setDirection((prev) => (prev === 'de-en' ? 'en-de' : 'de-en'));
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  /**
   * Prompts user to select image source (Camera vs Photo Gallery) for OCR scanning
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

  /**
   * Executes the image pick & OCR text extraction workflow
   */
  const executeScan = async (source: 'camera' | 'library') => {
    try {
      setIsScanning(true);
      const image = await pickImage(source);
      if (!image) return; // User canceled picker

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
   * Triggers main translation workflow when user taps "Translate"
   */
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Notice', `Please enter ${sourceLang === 'de' ? 'German' : 'English'} text to translate.`);
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Call translation pipeline service
      const result = await translateText(inputText, sourceLang, targetLang);
      setTranslatedText(result);

      // Step 2: Persist successful translation in AsyncStorage history
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
        {/* Header Section: Title & Language Direction Swap Button */}
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

        {/* Multiline Input Box Component */}
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

        {/* Translation Result Card (Displayed only when result exists) */}
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

// Visual Stylesheet
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
