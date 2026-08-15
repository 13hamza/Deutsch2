/**
 * History Storage Module (historyStorage.ts)
 * ------------------------------------------
 * Beginner Guide:
 * React Native provides `@react-native-async-storage/async-storage` as a simple,
 * unencrypted, asynchronous key-value storage engine (like localStorage in web development).
 * 
 * Data Flow:
 * 1. Saving: JavaScript Objects -> `JSON.stringify(data)` -> Disk Storage
 * 2. Reading: Disk Storage -> `JSON.parse(string)` -> JavaScript Objects
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryItemType, TranslationDirection } from '../types';

// The key string used to identify our stored history array in AsyncStorage
const HISTORY_KEY = '@german_translator_history';

/**
 * Retrieves all stored translation records from local device disk storage.
 * 
 * How it works:
 * - `AsyncStorage.getItem(key)` retrieves stored JSON text string.
 * - `JSON.parse()` converts the JSON string back into a JavaScript array of objects.
 * - Array `.sort()` sorts items by timestamp in descending order (newest first).
 * 
 * @returns Array of HistoryItemType objects sorted by newest first
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
 * Saves a new translation item to local device storage.
 * 
 * How it works:
 * 1. Reads existing history array from storage.
 * 2. Generates a unique ID string combining timestamp and random text.
 * 3. Prepends the new translation item to the beginning of the history array.
 * 4. Limits array length to 1000 items (to conserve device storage space).
 * 5. Saves serialized JSON string back to AsyncStorage.
 * 
 * @param translation - Object containing german text, english text, direction, and optional timestamp
 * @returns Newly created HistoryItemType object
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
    
    // Prepend new item to front of history array, capped at max 1000 entries
    const updatedHistory = [newItem, ...history].slice(0, 1000);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Error saving translation:', error);
    throw error;
  }
};

/**
 * Deletes a single translation record by its unique ID string.
 * 
 * How it works:
 * Uses JavaScript array `.filter()` method to create a new array excluding the target ID.
 * 
 * @param id - Unique item ID string to remove
 * @returns Promise<boolean> true if successfully removed
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
 * Completely wipes all saved history entries from local storage.
 * 
 * @returns Promise<boolean> true if successfully cleared
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
 * Searches stored history matching a user search query string.
 * 
 * How it works:
 * Case-insensitively checks if German or English text contains the query substring.
 * 
 * @param query - User typed search query
 * @returns Filtered array of matching HistoryItemType items
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
 * Exports all history entries as a formatted JSON string (useful for backup/sharing).
 * 
 * @returns Formatted JSON string or null
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
 * Overwrites local storage history with imported JSON data array string.
 * 
 * @param jsonData - JSON formatted string containing history array
 * @returns Promise<boolean> true if import succeeded
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
