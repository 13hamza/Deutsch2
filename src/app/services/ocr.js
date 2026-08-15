/**
 * OCR Service Module (ocr.js)
 * ----------------------------
 * Lets the user pick/capture an image and extracts text from it using
 * the free OCR.space API (demo key). Returns the extracted text string.
 */

import * as ImagePicker from 'expo-image-picker';

// Free shared demo key — swap for your own key from https://ocr.space/ocrapi
const OCR_API_KEY = 'helloworld';
const OCR_API_URL = 'https://api.ocr.space/parse/image';

/**
 * Asks for permission and opens the camera or gallery.
 * @param {'camera' | 'library'} source
 * @returns {Promise<{ base64: string } | null>}
 */
export const pickImage = async (source = 'library') => {
  const permissionResult =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error('Permission to access camera/gallery was denied.');
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
 * Sends a base64 image to OCR.space and returns extracted text.
 * @param {string} base64
 * @param {string} language - OCR.space language code, e.g. 'ger' or 'eng'
 * @returns {Promise<string>}
 */
export const extractTextFromImage = async (base64, language = 'ger') => {
  const formData = new FormData();
  formData.append('apikey', OCR_API_KEY);
  formData.append('language', language);
  formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
  formData.append('OCREngine', '2'); // engine 2 handles German umlauts better

  const response = await fetch(OCR_API_URL, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (data.IsErroredOnProcessing) {
    throw new Error(data.ErrorMessage?.[0] || 'OCR failed to process image.');
  }

  const text = data.ParsedResults?.[0]?.ParsedText || '';
  return text.trim();
};
