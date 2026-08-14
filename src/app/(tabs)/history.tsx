// src/app/(tabs)/history.tsx
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

export interface HistoryItemType {
  id: string;
  german: string;
  english: string;
  timestamp: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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

  // Reload history whenever screen comes into focus
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

  const renderSection = ({ item }: { item: [string, HistoryItemType[]] }) => {
    const [date, items] = item;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{date}</Text>
          <Text style={styles.sectionCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
        </View>
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
