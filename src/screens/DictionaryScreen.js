import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wordService } from '../services/wordService';
import WordCard from '../components/WordCard';
import Navbar from '../components/Navbar';

export default function DictionaryScreen({ navigation }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: '',
    length: '',
    exactLetters: '',
    onlyAlphabets: false,
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const searchTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    let count = 0;
    if (filters.difficulty) count++;
    if (filters.length) count++;
    if (filters.exactLetters) count++;
    if (filters.onlyAlphabets) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const loadWords = useCallback(async (currentPage, currentSearchTerm, currentFilters = filters) => {
    if (!isMountedRef.current) return;
    
    try {
      if (currentPage === 1) {
        setLoading(true);
      }
      
      const params = {
        page: currentPage,
        limit: 20,
        ...(currentSearchTerm && { search: currentSearchTerm }),
        ...(currentFilters.difficulty && { difficulty: currentFilters.difficulty }),
        ...(currentFilters.length && { length: currentFilters.length }),
        ...(currentFilters.exactLetters && { exactLetters: currentFilters.exactLetters }),
        ...(currentFilters.onlyAlphabets && { onlyAlphabets: 'true' }),
      };
      
      const response = await wordService.getWords(params);
      
      if (!isMountedRef.current) return;
      
      if (currentPage === 1) {
        setWords(response.words || []);
      } else {
        setWords(prev => [...prev, ...(response.words || [])]);
      }
      
      setHasMore(response.pagination?.hasNextPage || false);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [filters]);

  useEffect(() => {
    loadWords(1, '');
    setIsInitialLoad(false);
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isInitialLoad && page > 1) {
      loadWords(page, searchTerm);
    }
  }, [page]);

  useEffect(() => {
    if (isInitialLoad) return;
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setPage(1);
    setWords([]);
    
    searchTimeoutRef.current = setTimeout(() => {
      loadWords(1, searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!isInitialLoad) {
      setPage(1);
      setWords([]);
      loadWords(1, searchTerm, filters);
    }
  }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setSearchTerm('');
    setFilters({ difficulty: '', length: '', exactLetters: '', onlyAlphabets: false });
    setWords([]);
    loadWords(1, '');
  };

  const loadMore = () => {
    if (hasMore && !loading && !refreshing) {
      setPage(prev => prev + 1);
    }
  };

  const handleWordPress = (word) => {
    navigation.navigate('WordDetail', { word: word.word });
  };

  const clearFilters = () => {
    setFilters({ difficulty: '', length: '', exactLetters: '', onlyAlphabets: false });
  };

  if (loading && words.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
          onPress={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
        >
          <Ionicons name="chevron-back" size={18} color={page === 1 ? '#cbd5e1' : '#475569'} />
        </TouchableOpacity>

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.pageBtn, page === p && styles.pageBtnActive]}
            onPress={() => setPage(p)}
          >
            <Text style={[styles.pageText, page === p && styles.pageTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
          onPress={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
        >
          <Ionicons name="chevron-forward" size={18} color={page === totalPages ? '#cbd5e1' : '#475569'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar title="Dictionary" />
      {/* Clean Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search words..."
            placeholderTextColor="#94a3b8"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm ? (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={22} color="#475569" />
          {activeFilterCount > 0 && (
            <View style={styles.filterDot} />
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {filters.difficulty && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{filters.difficulty}</Text>
              <TouchableOpacity onPress={() => setFilters({ ...filters, difficulty: '' })}>
                <Ionicons name="close" size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}
          {filters.length && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{filters.length}</Text>
              <TouchableOpacity onPress={() => setFilters({ ...filters, length: '' })}>
                <Ionicons name="close" size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Words List */}
      <FlatList
        data={words}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <WordCard word={item} onPress={() => handleWordPress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No words found</Text>
          </View>
        }
        ListFooterComponent={
          <>
            {loading && words.length > 0 && (
              <ActivityIndicator size="small" color="#6366f1" style={styles.loader} />
            )}
            {renderPagination()}
          </>
        }
      />

      {/* Simple Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#475569" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Difficulty</Text>
                <View style={styles.options}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.option, filters.difficulty === d && styles.optionActive]}
                      onPress={() => setFilters({ ...filters, difficulty: filters.difficulty === d ? '' : d })}
                    >
                      <Text style={[styles.optionText, filters.difficulty === d && styles.optionTextActive]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Length</Text>
                <View style={styles.options}>
                  {['short', 'medium', 'long'].map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.option, filters.length === l && styles.optionActive]}
                      onPress={() => setFilters({ ...filters, length: filters.length === l ? '' : l })}
                    >
                      <Text style={[styles.optionText, filters.length === l && styles.optionTextActive]}>
                        {l}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Exact Letters</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Number of letters"
                  value={filters.exactLetters}
                  onChangeText={(text) => setFilters({ ...filters, exactLetters: text })}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnSecondary} onPress={clearFilters}>
                <Text style={styles.btnSecondaryText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setShowFilters(false)}>
                <Text style={styles.btnPrimaryText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  filtersScroll: {
    maxHeight: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  filterTagText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '500',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  empty: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  loader: {
    marginVertical: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  pageBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pageBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  pageTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  filterGroup: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  optionActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#6366f1',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  btnSecondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
