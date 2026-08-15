/**
 * ReviewScreen Component ((tabs)/review.tsx)
 * -----------------------------------------
 * Flashcard-style review tab for saved vocabulary words and full sentences.
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Word from '../components/Word';
import Sentence from '../components/Sentence';
import { getHistory } from '../storage/historyStorage';
import { HistoryItemType } from '../types';

export default function ReviewScreen() {
  const [items, setItems] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'words' | 'sentences'>('all');
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches saved items from local storage
   */
  const loadItems = useCallback(async () => {
    try {
      const history: HistoryItemType[] = await getHistory();
      setItems(history);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  /**
   * Counts for Words and Sentences categories
   */
  const wordCountTotal = useMemo(() => {
    return items.filter(
      (item) => item.german && item.german.trim().split(/\s+/).length === 1
    ).length;
  }, [items]);

  const sentenceCountTotal = useMemo(() => {
    return items.filter(
      (item) => item.german && item.german.trim().split(/\s+/).length > 1
    ).length;
  }, [items]);

  /**
   * Computed list of items based on category chips and search text
   */
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (filterType === 'words') {
      filtered = filtered.filter(
        (item) => item.german && item.german.trim().split(/\s+/).length === 1
      );
    } else if (filterType === 'sentences') {
      filtered = filtered.filter(
        (item) => item.german && item.german.trim().split(/\s+/).length > 1
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          (item.german && item.german.toLowerCase().includes(q)) ||
          (item.english && item.english.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [items, searchQuery, filterType]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems().then(() => setRefreshing(false));
  }, [loadItems]);

  const renderItem = ({ item }: { item: HistoryItemType }) => {
    const isWord = item.german && item.german.trim().split(/\s+/).length === 1;
    return isWord ? (
      <Word german={item.german} english={item.english} />
    ) : (
      <Sentence german={item.german} english={item.english} />
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vocabulary Review</Text>
        <Text style={styles.headerSubtext}>
          Review and practice your saved vocabulary flashcards
        </Text>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vocabulary..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Category Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
            All ({items.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === 'words' && styles.activeFilter]}
          onPress={() => setFilterType('words')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterType === 'words' && styles.activeFilterText]}>
            Words ({wordCountTotal})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filterType === 'sentences' && styles.activeFilter]}
          onPress={() => setFilterType('sentences')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filterType === 'sentences' && styles.activeFilterText]}>
            Sentences ({sentenceCountTotal})
          </Text>
        </TouchableOpacity>

        {(searchQuery || filterType !== 'all') && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearFilters}>
            <Ionicons name="close-circle-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {/* Vocabulary List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2c6b3f']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="book-outline" size={48} color="#2c6b3f" />
            </View>
            <Text style={styles.emptyStateText}>No vocabulary found</Text>
            <Text style={styles.emptyStateSubtext}>
              {items.length === 0
                ? 'Start translating words or sentences on the main screen to build your review collection.'
                : 'No items match your active search query or filter.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 18,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b4332',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 15,
    color: '#0f172a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#e2e8f0',
  },
  activeFilter: {
    backgroundColor: '#2c6b3f',
  },
  filterText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  clearFilters: {
    padding: 4,
    marginLeft: 'auto',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 30,
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
