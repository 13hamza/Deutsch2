// src/storage/historyStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@german_translator_history';
const STORAGE_VERSION = '1.0';

// Get all history items
export const getHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    if (json === null) {
      return [];
    }
    const history = JSON.parse(json);
    // Sort by timestamp descending (newest first)
    return history.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

// Save a translation
export const saveTranslation = async (translation) => {
  try {
    const history = await getHistory();
    const newItem = {
      id: Date.now().toString(),
      ...translation,
      timestamp: translation.timestamp || new Date().toISOString(),
    };
    
    // Add to history (limit to 1000 items)
    const updatedHistory = [newItem, ...history].slice(0, 1000);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return newItem;
  } catch (error) {
    console.error('Error saving translation:', error);
    throw error;
  }
};

// Delete a translation
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

// Delete all history
export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

// Search history
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

// Get history by date
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

// Export history as JSON
export const exportHistory = async () => {
  try {
    const history = await getHistory();
    return JSON.stringify(history, null, 2);
  } catch (error) {
    console.error('Error exporting history:', error);
    return null;
  }
};

// Import history from JSON
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