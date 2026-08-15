/**
 * HistoryScreen Component ((tabs)/history.tsx)
 * -------------------------------------------
 * Displays date-grouped history of all translations saved in device storage.
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
import { HistoryItemType, GroupedHistory } from '../types';
import { groupByDate } from '../utils/dateUtils';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Loads history items from storage
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

  // Reload history whenever user focuses this screen
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleSearchChange = async (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const searched: HistoryItemType[] = await searchHistory(text);
      setFilteredHistory(searched);
    } else {
      setFilteredHistory(history);
    }
  };

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
            await loadHistory();
          },
        },
      ]
    );
  };

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHistory().then(() => setRefreshing(false));
  }, [loadHistory]);

  const renderSection = ({ item }: { item: GroupedHistory }) => {
    const { date, items } = item;
    return (
      <View style={styles.section}>
        {/* Date Group Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{date}</Text>
          <Text style={styles.sectionCount}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        {/* Render each HistoryItem card */}
        {items.map((historyItem: HistoryItemType) => (
          <HistoryItem
            key={historyItem.id}
            item={historyItem}
            onDelete={handleDelete}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar & Clear Action Button */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search history..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {history.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.clearAllBtn}
            accessibilityLabel="Clear all history"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* List vs Empty state */}
      {filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="time-outline" size={48} color="#2c6b3f" />
          </View>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No matching history' : 'No history yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery
              ? 'Try searching for a different word or phrase'
              : 'Your translations will automatically appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupByDate(filteredHistory)}
          renderItem={renderSection}
          keyExtractor={(group) => group.date}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2c6b3f']} />
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
    backgroundColor: '#f8fafc',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingLeft: 4,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    margin: 14,
    marginRight: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  clearAllBtn: {
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b4332',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
  },
});
