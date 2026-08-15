/**
 * Centralized TypeScript Interface Definitions for Deutsch2
 */

export type TranslationDirection = 'de-en' | 'en-de';

export interface HistoryItemType {
  id: string;
  german: string;
  english: string;
  direction?: TranslationDirection;
  timestamp: string;
}

export interface GroupedHistory {
  date: string;
  items: HistoryItemType[];
}

export interface PickImageResult {
  base64: string;
}

export type OCRLanguage = 'ger' | 'eng';
