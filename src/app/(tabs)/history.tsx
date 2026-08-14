/**
 * HistoryScreen Component ((tabs)/history.tsx)
 * -------------------------------------------
 * Displays a list of all saved translation records stored in local device storage.
 * 
 * Beginners Guide:
 * 1. useFocusEffect: An Expo Router / React Navigation hook that triggers every time this screen becomes active/focused.
 * 2. FlatList: A high-performance React Native component for rendering long scrollable lists efficiently.
 * 3. Search & Filter: Filters saved translations live as the user types in the search box.
 * 4. RefreshControl: Adds "pull to refresh" capability to re-fetch history manually.
 * 5. Clear & Delete: Provides user alerts to delete single translation items or wipe all history.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HistoryItem from '../components/HistoryItem';
import { getHistory, deleteTranslation, searchHistory, clearHistory } from '../storage/historyStorage';

// TypeScript Interface describing the shape of a single history entry
export interface HistoryItemType {
  id: string;
  german: string;
  english: string;
  timestamp: string;
}

export default function HistoryScreen() {
  // Array holding all stored history items
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  // Array holding history items filtered by user search query
  const [filteredHistory, setFilteredHistory] = useState<HistoryItemType[]>([]);
  // State for current search text typed into the search bar
  const [searchQuery, setSearchQuery] = useState('');
  // Pull-to-refresh state indicator
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Loads history entries from AsyncStorage
   */
  const loadHistory = useCallback(async () => {
    try {
      const data: HistoryItemType[] = await getHistory();
      setHistory(data);
      if (searchQuery.trim()) {
        const searched: HistoryItemType[] = await searchHistory(searchQuery);
        setFilteredHistory(searched);
      } else {
        setFilteredHistory(data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, [searchQuery]);

  // Re-run loadHistory whenever user switches tabs to view the History screen
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  /**
   * Handles typing inside the search input box
   */
  const handleSearchChange = async (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const searched: HistoryItemType[] = await searchHistory(text);
      setFilteredHistory(searched);
    } else {
      setFilteredHistory(history);
    }
  };

  /**
   * Deletes an individual translation item after user confirmation prompt
   */
  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this translation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTranslation(id);
            await loadHistory(); // Refresh list after deletion
          },
        },
      ]
    );
  };

  /**
   * Clears all translation records after confirmation prompt
   */
  const handleClearAll = () => {
    if (history.length === 0) return;
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all saved translations?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            await loadHistory();
          },
        },
      ]
    );
  };

  /**
   * Pull-to-refresh callback function
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory().then(() => setRefreshing(false));
  }, [loadHistory]);

  /**
   * Helper function: Groups translation items by date string (e.g., "8/14/2026")
   */
  const groupByDate = (items: HistoryItemType[]): [string, HistoryItemType[]][] => {
    const groups: Record<string, HistoryItemType[]> = {};
    items.forEach(item => {
      const date = item.timestamp 
        ? new Date(item.timestamp).toLocaleDateString()
        : 'Recent';
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return Object.entries(groups);
  };

  /**
   * Renders a single grouped section (Date header + items inside that date)
   */
  const renderSection = ({ item }: { item: [string, HistoryItemType[]] }) => {
    const [date, items] = item;
    return (
      <View style={styles.section}>
        {/* Date Group Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{date}</Text>
          <Text style={styles.sectionCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
        </View>
        {/* Render each HistoryItem card */}
        {items.map((historyItem: HistoryItemType) => (
          <HistoryItem 
            key={historyItem.id || Math.random().toString()} 
            item={historyItem} 
            onDelete={handleDelete}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Search Bar & Clear All Button */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search history..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllBtn}>
            <Ionicons name="trash" size={18} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>

      {/* Conditional rendering: Empty state vs FlatList */}
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No history yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Your translations will automatically appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupByDate(filteredHistory)}
          renderItem={renderSection}
          keyExtractor={([date]) => date}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginRight: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  clearAllBtn: {
    padding: 10,
    backgroundColor: '#fdeae8',
    borderRadius: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  sectionCount: {
    fontSize: 13,
    color: '#888',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
