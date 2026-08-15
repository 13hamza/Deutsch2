/**
 * OCR Service Module (ocr.ts)
 * ----------------------------
 * Beginner Guide:
 * OCR stands for Optical Character Recognition.
 * This service lets users select a photo from their photo library or take a new picture
 * with their camera using `expo-image-picker`, converts the image into a Base64 string,
 * and sends it to the free OCR.space web API to extract printed text.
 */

import * as ImagePicker from 'expo-image-picker';
import { OCRLanguage, PickImageResult } from '../types';

// API endpoints and credentials for OCR.space
const OCR_API_KEY = 'helloworld'; // Shared demo API key
const OCR_API_URL = 'https://api.ocr.space/parse/image';

/**
 * Requests device permissions and launches native camera or media library picker.
 * 
 * How it works:
 * 1. Checks permissions (`requestCameraPermissionsAsync` or `requestMediaLibraryPermissionsAsync`).
 * 2. Opens native camera or gallery picker UI.
 * 3. Encodes selected image to Base64 string.
 * 
 * @param source - Choice of 'camera' or 'library'
 * @returns Promise<PickImageResult | null> Object containing base64 string or null if user cancels
 */
export const pickImage = async (
  source: 'camera' | 'library' = 'library'
): Promise<PickImageResult | null> => {
  // Step 1: Request permission from user
  const permissionResult =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error('Permission to access camera or gallery was denied.');
  }

  // Step 2: Open native UI picker
  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });

  // Step 3: Handle cancelation or missing base64 payload
  if (result.canceled || !result.assets?.[0]?.base64) {
    return null;
  }

  return { base64: result.assets[0].base64 };
};

/**
 * Sends a base64 encoded image to OCR.space and parses returned text string.
 * 
 * How it works:
 * - Constructs `FormData` payload containing apikey, language ('ger' or 'eng'),
 *   and base64 image data string.
 * - `OCREngine: 2` is specifically selected because Engine 2 excels at reading German umlauts (ä, ö, ü, ß).
 * - HTTP POST request is sent to `https://api.ocr.space/parse/image`.
 * 
 * @param base64 - Base64 image payload string
 * @param language - Target OCR language ('ger' or 'eng')
 * @returns Promise<string> Extracted text string
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

  // Send multipart HTTP POST request
  const response = await fetch(OCR_API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  // Check if OCR.space returned an processing error
  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.[0] || 'OCR failed to process the image.');
  }

  // Extract parsed text string from response payload
  const text = data.ParsedResults?.[0]?.ParsedText || '';
  return text.trim();
};
