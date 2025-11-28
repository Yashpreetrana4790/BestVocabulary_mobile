import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryService } from '../services/categoryService';
import Navbar from '../components/Navbar';

export default function CategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'recent', // recent, alphabetical, wordCount
    includeWords: false,
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    let count = 0;
    if (filters.sortBy && filters.sortBy !== 'recent') count++;
    if (filters.includeWords) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const loadCategories = useCallback(async (search = '', currentFilters = filters) => {
    try {
      setLoading(true);
      
      const params = {
        limit: 100,
        ...(search && { search }),
        ...(currentFilters.includeWords && { includeWords: 'true' }),
      };
      
      const response = await categoryService.getCategories(params);
      let data = response.data || [];
      
      // Client-side sorting
      if (currentFilters.sortBy === 'alphabetical') {
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
      } else if (currentFilters.sortBy === 'wordCount') {
        data = [...data].sort((a, b) => (b.words?.length || 0) - (a.words?.length || 0));
      }
      
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      loadCategories(searchTerm);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    loadCategories(searchTerm, filters);
  }, [filters]);

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchTerm('');
    setFilters({ sortBy: 'recent', includeWords: false });
    loadCategories('');
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', { categoryId: category._id });
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'recent', includeWords: false });
  };

  if (loading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar title="Categories" />
      {/* Search and Filter Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
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
          {filters.sortBy !== 'recent' && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>
                Sort: {filters.sortBy === 'alphabetical' ? 'A-Z' : 'By Words'}
              </Text>
              <TouchableOpacity onPress={() => setFilters({ ...filters, sortBy: 'recent' })}>
                <Ionicons name="close" size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}
          {filters.includeWords && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>With Words</Text>
              <TouchableOpacity onPress={() => setFilters({ ...filters, includeWords: false })}>
                <Ionicons name="close" size={14} color="#6366f1" />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Categories List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
            activeOpacity={0.7}
          >
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.categoryImage} />
            ) : (
              <View style={[styles.categoryIcon, { backgroundColor: item.color || '#6366f1' }]}>
                <Text style={styles.iconText}>{item.icon || '📚'}</Text>
              </View>
            )}
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.categoryDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.metaRow}>
                <View style={styles.meta}>
                  <Ionicons name="book-outline" size={14} color="#94a3b8" />
                  <Text style={styles.wordCount}>
                    {item.words?.length || 0} words
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      {/* Filter Modal */}
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
              {/* Sort By */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.options}>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      filters.sortBy === 'recent' && styles.optionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: 'recent' })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === 'recent' && styles.optionTextActive,
                      ]}
                    >
                      Recent
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      filters.sortBy === 'alphabetical' && styles.optionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: 'alphabetical' })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === 'alphabetical' && styles.optionTextActive,
                      ]}
                    >
                      A-Z
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.option,
                      filters.sortBy === 'wordCount' && styles.optionActive,
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: 'wordCount' })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === 'wordCount' && styles.optionTextActive,
                      ]}
                    >
                      Most Words
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Include Words */}
              <View style={styles.filterGroup}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() =>
                    setFilters({ ...filters, includeWords: !filters.includeWords })
                  }
                >
                  <Ionicons
                    name={filters.includeWords ? 'checkbox' : 'square-outline'}
                    size={24}
                    color={filters.includeWords ? '#6366f1' : '#94a3b8'}
                  />
                  <Text style={styles.checkboxLabel}>
                    Include words in response
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.btnSecondary} onPress={clearFilters}>
                <Text style={styles.btnSecondaryText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => setShowFilters(false)}
              >
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
  listContent: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordCount: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#475569',
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
