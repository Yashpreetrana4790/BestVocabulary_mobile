import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { categoryService } from '../services/categoryService';
import WordCard from '../components/WordCard';

export default function CategoryDetailScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategoryById(categoryId);
      setCategory(response.data);
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWordPress = (word) => {
    navigation.navigate('Dictionary', {
      screen: 'WordDetail',
      params: { word: word.word },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const words = category.words || [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Category Header */}
        <View style={styles.header}>
          {category.image ? (
            <Image source={{ uri: category.image }} style={styles.headerImage} />
          ) : (
            <View style={[styles.headerIcon, { backgroundColor: category.color || '#3b82f6' }]}>
              <Text style={styles.headerIconText}>{category.icon || '📚'}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.categoryName}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription}>{category.description}</Text>
            )}
            <Text style={styles.wordCount}>{words.length} words</Text>
          </View>
        </View>

        {/* Words List */}
        <View style={styles.wordsSection}>
          <Text style={styles.sectionTitle}>Words in this Category</Text>
          {words.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No words in this category yet</Text>
            </View>
          ) : (
            words.map((word, index) => (
              <WordCard
                key={word._id || index}
                word={word}
                onPress={() => handleWordPress(word)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconText: {
    fontSize: 40,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  wordCount: {
    fontSize: 14,
    color: '#9ca3af',
  },
  wordsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

