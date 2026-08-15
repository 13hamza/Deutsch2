/**
 * TypeScript Interface Definitions (src/app/types/index.ts)
 * --------------------------------------------------------
 * Beginner Guide:
 * TypeScript interfaces act as contracts or blueprints for data objects in JavaScript.
 * Defining types here ensures every function and component receives the exact expected data structure,
 * preventing unexpected errors like "undefined is not an object".
 */

/**
 * Defines the translation direction:
 * - 'de-en': German input to English output
 * - 'en-de': English input to German output
 */
export type TranslationDirection = 'de-en' | 'en-de';

/**
 * Shape of a saved translation record stored in persistent storage
 */
export interface HistoryItemType {
  /** Unique ID string for identifying each saved translation entry */
  id: string;
  /** The German text phrase */
  german: string;
  /** The English text translation */
  english: string;
  /** Translation direction used during translation ('de-en' or 'en-de') */
  direction?: TranslationDirection;
  /** ISO timestamp string when the translation was created */
  timestamp: string;
}

/**
 * Group of history items categorized under a specific date heading (e.g. "Today" or "Aug 15, 2026")
 */
export interface GroupedHistory {
  /** Display label for the group (e.g., "Today", "Yesterday") */
  date: string;
  /** Array of translation history items falling on this date */
  items: HistoryItemType[];
}

/**
 * Return type from image picker containing base64 encoded string
 */
export interface PickImageResult {
  /** Base64 string payload of picked image */
  base64: string;
}

/**
 * Supported OCR language codes for the OCR.space API engine
 * - 'ger': German language OCR parsing
 * - 'eng': English language OCR parsing
 */
export type OCRLanguage = 'ger' | 'eng';
