import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { API_CONFIG } from '../config/api';

export default function WordCard({ word, onPress, showSaveButton = true }) {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const primaryMeaning = word?.meanings?.[0];
  const pronunciation = word?.pronunciation || primaryMeaning?.pronunciation;
  const meaning = primaryMeaning?.meaning || primaryMeaning?.easyMeaning || primaryMeaning?.kiddefinition;
  const difficulty = primaryMeaning?.difficulty || word?.frequency;
  const meaningsCount = word?.meanings?.length || 0;
  const partOfSpeech = primaryMeaning?.pos;

  useEffect(() => {
    checkIfSaved();
  }, [user, word?._id]);

  const checkIfSaved = () => {
    if (!isAuthenticated || !user || !word?._id) {
      setIsSaved(false);
      return;
    }
    
    const savedWordIds = user.savedWords?.map(w => w._id || w) || [];
    setIsSaved(savedWordIds.includes(word._id.toString()));
  };

  const handleSave = async (e) => {
    e?.stopPropagation?.();
    
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to save words', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => {} }, // Will be handled by parent
      ]);
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        // Unsave word
        await api.delete(`${API_CONFIG.ENDPOINTS.USER}/save-word/${word._id}`);
        setIsSaved(false);
      } else {
        // Save word
        await api.post(`${API_CONFIG.ENDPOINTS.USER}/save-word/${word._id}`);
        setIsSaved(true);
      }
      // Update user context
      await updateUser();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save word');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyColor = (diff) => {
    if (!diff) return '#64748b';
    const lower = diff.toLowerCase();
    if (lower === 'beginner' || lower === 'easy') return '#10b981';
    if (lower === 'intermediate' || lower === 'medium') return '#f59e0b';
    if (lower === 'advanced' || lower === 'hard') return '#ef4444';
    return '#6366f1';
  };

  const difficultyColor = getDifficultyColor(difficulty);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.wordSection}>
            <Text style={styles.word}>{word?.word}</Text>
            {pronunciation && (
              <View style={styles.pronunciationRow}>
                <Ionicons name="volume-medium-outline" size={14} color="#64748b" />
                <Text style={styles.pronunciation}>{pronunciation}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            {difficulty && (
              <View style={[styles.difficulty, { borderColor: difficultyColor }]}>
                <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                  {difficulty}
                </Text>
              </View>
            )}
            {showSaveButton && isAuthenticated && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={saving}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? '#6366f1' : '#94a3b8'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {partOfSpeech && (
          <Text style={styles.pos}>{partOfSpeech}</Text>
        )}

        {meaning && (
          <Text style={styles.meaning} numberOfLines={2}>
            {meaning}
          </Text>
        )}

        <View style={styles.footer}>
          {meaningsCount > 0 && (
            <View style={styles.meta}>
              <Ionicons name="book-outline" size={14} color="#94a3b8" />
              <Text style={styles.metaText}>
                {meaningsCount} meaning{meaningsCount > 1 ? 's' : ''}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    padding: 4,
  },
  wordSection: {
    flex: 1,
  },
  word: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pronunciation: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  difficulty: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pos: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  meaning: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
