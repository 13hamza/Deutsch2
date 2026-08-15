/**
 * OCR Service Module (ocr.ts)
 * ----------------------------
 * Captures or picks an image and extracts text using the OCR.space API.
 */

import * as ImagePicker from 'expo-image-picker';
import { OCRLanguage, PickImageResult } from '../types';

const OCR_API_KEY = 'helloworld';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

/**
 * Requests permissions and launches camera or media library picker
 */
export const pickImage = async (
  source: 'camera' | 'library' = 'library'
): Promise<PickImageResult | null> => {
  const permissionResult =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error('Permission to access camera or gallery was denied.');
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

  if (result.canceled || !result.assets?.[0]?.base64) {
    return null;
  }

  return { base64: result.assets[0].base64 };
};

/**
 * Sends a base64 image to OCR.space and parses returned text
 */
export const extractTextFromImage = async (
  base64: string,
  language: OCRLanguage = 'ger'
): Promise<string> => {
  const formData = new FormData();
  formData.append('apikey', OCR_API_KEY);
  formData.append('language', language);
  formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
  formData.append('OCREngine', '2'); // Engine 2 handles German umlauts (ä, ö, ü, ß) better

  const response = await fetch(OCR_API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.[0] || 'OCR failed to process the image.');
  }

  const text = data.ParsedResults?.[0]?.ParsedText || '';
  return text.trim();
};
