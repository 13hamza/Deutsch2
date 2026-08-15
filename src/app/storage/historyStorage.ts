/**
 * History Storage Module (historyStorage.ts)
 * ------------------------------------------
 * Local storage layer using `@react-native-async-storage/async-storage`.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItemType, TranslationDirection } from '../types';

const HISTORY_KEY = '@german_translator_history';

/**
 * Retrieves all stored translation records from local storage
 */
export const getHistory = async (): Promise<HistoryItemType[]> => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    if (!json) {
      return [];
    }
    const history: HistoryItemType[] = JSON.parse(json);
    return history.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error loading history from storage:', error);
    return [];
  }
};

/**
 * Saves a new translation item to local storage
 */
export const saveTranslation = async (translation: {
  german: string;
  english: string;
  direction?: TranslationDirection;
  timestamp?: string;
}): Promise<HistoryItemType> => {
  try {
    const history = await getHistory();
    const newItem: HistoryItemType = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
      direction: translation.direction || 'de-en',
      german: translation.german.trim(),
      english: translation.english.trim(),
      timestamp: translation.timestamp || new Date().toISOString(),
    };
    
    // Prepend new item to front of history array, capped at 1000 items
    const updatedHistory = [newItem, ...history].slice(0, 1000);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Error saving translation:', error);
    throw error;
  }
};

/**
 * Deletes a single item by unique ID
 */
export const deleteTranslation = async (id: string): Promise<boolean> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (error) {
    console.error('Error deleting translation:', error);
    throw error;
  }
};

/**
 * Deletes all stored history records
 */
export const clearHistory = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

/**
 * Filters stored history array matching search query
 */
export const searchHistory = async (query: string): Promise<HistoryItemType[]> => {
  try {
    const history = await getHistory();
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return history;
    
    return history.filter(
      (item) =>
        item.german.toLowerCase().includes(lowerQuery) ||
        item.english.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching history:', error);
    return [];
  }
};

/**
 * Exports history array as formatted JSON string
 */
export const exportHistory = async (): Promise<string | null> => {
  try {
    const history = await getHistory();
    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error('Error exporting history:', error);
    return null;
  }
};

/**
 * Overwrites local history with imported JSON data array string
 */
export const importHistory = async (jsonData: string): Promise<boolean> => {
  try {
    const history = JSON.parse(jsonData);
    if (!Array.isArray(history)) {
      throw new Error('Invalid history format');
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
};
