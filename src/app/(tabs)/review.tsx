// src/app/(tabs)/review.tsx
import React, { useState, useCallback } from 'react';
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
import { HistoryItemType } from './history';

export default function ReviewScreen() {
  const [items, setItems] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'words' | 'sentences'>('all');
  const [refreshing, setRefreshing] = useState(false);

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

  const filteredItems = React.useMemo(() => {
    let filtered = items;

    // Filter by type
    if (filterType === 'words') {
      filtered = filtered.filter(item => 
        item.german && item.german.trim().split(/\s+/).length === 1
      );
    } else if (filterType === 'sentences') {
      filtered = filtered.filter(item => 
        item.german && item.german.trim().split(/\s+/).length > 1
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Vocabulary</Text>
        <Text style={styles.headerSubtext}>Practice and listen to your saved vocabulary</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'all' && styles.activeFilter]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterText, filterType === 'all' && styles.activeFilterText]}>
            All ({items.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'words' && styles.activeFilter]}
          onPress={() => setFilterType('words')}
        >
          <Text style={[styles.filterText, filterType === 'words' && styles.activeFilterText]}>
            Words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterType === 'sentences' && styles.activeFilter]}
          onPress={() => setFilterType('sentences')}
        >
          <Text style={[styles.filterText, filterType === 'sentences' && styles.activeFilterText]}>
            Sentences
          </Text>
        </TouchableOpacity>
        {(searchQuery || filterType !== 'all') && (
          <TouchableOpacity onPress={clearFilters} style={styles.clearFilters}>
            <Ionicons name="close-circle-outline" size={22} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No vocabulary found</Text>
            <Text style={styles.emptyStateSubtext}>
              {items.length === 0
                ? 'Start translating words or sentences on the main screen to build your review collection'
                : 'No items match your active search or filter'}
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
    backgroundColor: '#f5f7f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c6b3f',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 16,
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
    backgroundColor: '#e2e8e2',
  },
  activeFilter: {
    backgroundColor: '#2c6b3f',
  },
  filterText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
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
    marginTop: 40,
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
