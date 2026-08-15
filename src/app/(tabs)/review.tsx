/**
 * ReviewScreen Component ((tabs)/review.tsx)
 * -----------------------------------------
 * Beginner Guide:
 * Flashcard-style review tab for practicing translated words and full sentences.
 * 
 * Key Features:
 * 1. Dynamic Filtering: Automatically categorizes saved history items by word count:
 *    - Single word (e.g., "Haus") -> Rendered with expandable `<Word />` card.
 *    - Full sentence (e.g., "Wie geht es dir?") -> Rendered with expandable `<Sentence />` card.
 * 2. React `useMemo`: Efficiently memoizes filtered output arrays so expensive array filtering only re-runs when search query or filter type changes.
 * 3. Interactive Category Chips: Filter buttons showing live counts (`All (12)`, `Words (5)`, `Sentences (7)`).
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
  // State: All loaded vocabulary items
  const [items, setItems] = useState<HistoryItemType[]>([]);

  // State: Active search query string
  const [searchQuery, setSearchQuery] = useState('');

  // State: Active filter category ('all', 'words', 'sentences')
  const [filterType, setFilterType] = useState<'all' | 'words' | 'sentences'>('all');

  // State: Pull-to-refresh activity indicator
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetches saved translation items from AsyncStorage local storage
   */
  const loadItems = useCallback(async () => {
    try {
      const history: HistoryItemType[] = await getHistory();
      setItems(history);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }, []);

  // Reload vocabulary every time user taps onto the Review screen
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  /**
   * Count total items that are single words (word count === 1)
   */
  const wordCountTotal = useMemo(() => {
    return items.filter(
      (item) => item.german && item.german.trim().split(/\s+/).length === 1
    ).length;
  }, [items]);

  /**
   * Count total items that are full sentences (word count > 1)
   */
  const sentenceCountTotal = useMemo(() => {
    return items.filter(
      (item) => item.german && item.german.trim().split(/\s+/).length > 1
    ).length;
  }, [items]);

  /**
   * Computed array of vocabulary items based on active category chips and search query
   */
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by word vs sentence classification
    if (filterType === 'words') {
      filtered = filtered.filter(
        (item) => item.german && item.german.trim().split(/\s+/).length === 1
      );
    } else if (filterType === 'sentences') {
      filtered = filtered.filter(
        (item) => item.german && item.german.trim().split(/\s+/).length > 1
      );
    }

    // Filter by user search input query
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

  /**
   * Pull-to-refresh callback handler
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems().then(() => setRefreshing(false));
  }, [loadItems]);

  /**
   * Chooses appropriate component card representation: Word vs Sentence
   */
  const renderItem = ({ item }: { item: HistoryItemType }) => {
    const isWord = item.german && item.german.trim().split(/\s+/).length === 1;
    return isWord ? (
      <Word german={item.german} english={item.english} />
    ) : (
      <Sentence german={item.german} english={item.english} />
    );
  };

  /**
   * Resets active filter chips and search query back to default
   */
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

      {/* Search Bar Input */}
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

      {/* Category Filter Chips: All / Words / Sentences */}
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

      {/* Vocabulary Flashcards FlatList */}
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

// Component Visual Stylesheet
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
