/**
 * History Storage Module (historyStorage.js)
 * ------------------------------------------
 * Persistent key-value storage layer using React Native's `@react-native-async-storage/async-storage`.
 * 
 * Beginners Guide:
 * 1. AsyncStorage: Save data locally on mobile devices (persists across app restarts).
 * 2. Serialization: Objects are serialized to JSON strings (`JSON.stringify`) when saved, and parsed back (`JSON.parse`) when read.
 * 3. Functions included:
 *    - `getHistory`: Reads all saved entries sorted newest-first.
 *    - `saveTranslation`: Appends new translation entry.
 *    - `deleteTranslation`: Deletes specific item by ID.
 *    - `clearHistory`: Wipes all saved history entries.
 *    - `searchHistory`: Case-insensitive text search.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key key-name in key-value store
const HISTORY_KEY = '@german_translator_history';

/**
 * Retrieves all stored translation records from device disk storage
 * @returns {Promise<Array>} Array of translation objects sorted by newest first
 */
export const getHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    if (json === null) {
      return [];
    }
    const history = JSON.parse(json);
    // Sort array by timestamp descending (newest entries at top of list)
    return history.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

/**
 * Saves a new translation item to local storage
 * @param {Object} translation - `{ german: string, english: string, timestamp?: string }`
 * @returns {Promise<Object>} Newly created translation object with unique ID
 */
export const saveTranslation = async (translation) => {
  try {
    const history = await getHistory();
    const newItem = {
      id: Date.now().toString(), // Generate unique timestamp-based ID string
      ...translation,
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
 * Deletes a single item by unique ID string
 */
export const deleteTranslation = async (id) => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
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
export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

/**
 * Filters stored history array matching search query string
 */
export const searchHistory = async (query) => {
  try {
    const history = await getHistory();
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return history;
    
    return history.filter(item =>
      item.german.toLowerCase().includes(lowerQuery) ||
      item.english.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching history:', error);
    return [];
  }
};

/**
 * Filters history items matching specific date object
 */
export const getHistoryByDate = async (date) => {
  try {
    const history = await getHistory();
    const dateStr = date.toISOString().split('T')[0];
    return history.filter(item =>
      item.timestamp.startsWith(dateStr)
    );
  } catch (error) {
    console.error('Error getting history by date:', error);
    return [];
  }
};

/**
 * Exports history array as formatted JSON string
 */
export const exportHistory = async () => {
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
export const importHistory = async (jsonData) => {
  try {
    const history = JSON.parse(jsonData);
    if (!Array.isArray(history)) {
      throw new Error('Invalid history data');
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error importing history:', error);
    return false;
  }
};