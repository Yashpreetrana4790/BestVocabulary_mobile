import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import WordCard from '../components/WordCard';
import api from '../services/api';
import { API_CONFIG } from '../config/api';

export default function SavedWordsScreen({ navigation }) {
  const { user, updateUser } = useAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedWords();
  }, []);

  const loadSavedWords = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USER}/saved-words`);
      setWords(response.words || []);
    } catch (error) {
      console.error('Error loading saved words:', error);
      setWords([]);
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
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Words</Text>
        <Text style={styles.headerSubtitle}>{words.length} words saved</Text>
      </View>

      {words.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No saved words yet</Text>
          <Text style={styles.emptySubtext}>
            Save words to review them later
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Dictionary')}
          >
            <Text style={styles.browseButtonText}>Browse Dictionary</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={words}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <WordCard word={item} onPress={() => handleWordPress(item)} />
          )}
          contentContainerStyle={styles.list}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

