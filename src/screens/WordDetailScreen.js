import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wordService } from '../services/wordService';

export default function WordDetailScreen({ route, navigation }) {
  const { word: wordParam } = route.params;
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWord();
  }, [wordParam]);

  const loadWord = async () => {
    try {
      setLoading(true);
      const word = await wordService.getWord(wordParam);
      setWordData(word);
    } catch (error) {
      console.error('Error loading word:', error);
    } finally {
      setLoading(false);
    }
  };

  const playPronunciation = () => {
    // Pronunciation playback will use device TTS
    // This is a placeholder - can be enhanced with expo-speech or similar
    console.log('Pronunciation:', wordData?.word);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!wordData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Word not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const meaningsByPos = {};
  if (wordData?.meanings) {
    wordData.meanings.forEach((meaning) => {
      const pos = meaning.pos || 'Other';
      if (!meaningsByPos[pos]) {
        meaningsByPos[pos] = [];
      }
      meaningsByPos[pos].push(meaning);
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Word Header */}
        <View style={styles.header}>
          <View style={styles.wordHeader}>
            <Text style={styles.wordTitle}>{wordData.word}</Text>
            {wordData.pronunciation && (
              <TouchableOpacity
                style={styles.pronunciationButton}
                onPress={playPronunciation}
              >
                <Ionicons name="volume-medium" size={20} color="#3b82f6" />
                <Text style={styles.pronunciation}>{wordData.pronunciation}</Text>
              </TouchableOpacity>
            )}
            {wordData.frequency && (
              <View style={styles.frequencyBadge}>
                <Text style={styles.frequencyText}>{wordData.frequency}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Meanings by Part of Speech */}
        {Object.entries(meaningsByPos).map(([pos, meanings]) => (
          <View key={pos} style={styles.section}>
            <View style={styles.posHeader}>
              <View style={styles.posLine} />
              <Text style={styles.posTitle}>{pos}</Text>
            </View>
            
            {meanings.map((meaning, index) => (
              <View key={index} style={styles.meaningItem}>
                <View style={styles.meaningHeader}>
                  <Text style={styles.meaningNumber}>{index + 1}.</Text>
                  {meaning.subtitle && (
                    <Text style={styles.meaningSubtitle}>{meaning.subtitle}</Text>
                  )}
                  {meaning.difficulty && (
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>{meaning.difficulty}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.meaningText}>
                  {meaning.meaning || meaning.easyMeaning || meaning.kiddefinition}
                </Text>
                
                {meaning.example_sentences && meaning.example_sentences.length > 0 && (
                  <View style={styles.examplesContainer}>
                    <Text style={styles.examplesTitle}>Examples:</Text>
                    {meaning.example_sentences.map((example, idx) => (
                      <Text key={idx} style={styles.exampleText}>
                        "{typeof example === 'string' ? example : example.text || example}"
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Synonyms */}
        {wordData.meanings?.some(m => m.synonyms?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synonyms</Text>
            <View style={styles.tagsContainer}>
              {wordData.meanings
                .flatMap(m => m.synonyms || [])
                .filter(s => typeof s === 'object' && s.word)
                .map((synonym, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => navigation.replace('WordDetail', { word: synonym.word })}
                  >
                    <Text style={styles.tagText}>{synonym.word}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {/* Antonyms */}
        {wordData.meanings?.some(m => m.antonyms?.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Antonyms</Text>
            <View style={styles.tagsContainer}>
              {wordData.meanings
                .flatMap(m => m.antonyms || [])
                .filter(a => typeof a === 'object' && a.word)
                .map((antonym, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => navigation.replace('WordDetail', { word: antonym.word })}
                  >
                    <Text style={styles.tagText}>{antonym.word}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {/* Etymology */}
        {wordData.etymology && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Word History</Text>
            <Text style={styles.etymologyText}>{wordData.etymology}</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  wordHeader: {
    gap: 12,
  },
  wordTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pronunciationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pronunciation: {
    fontSize: 18,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  frequencyBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  frequencyText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  posHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  posLine: {
    width: 4,
    height: 24,
    backgroundColor: '#9333ea',
    borderRadius: 2,
  },
  posTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  meaningItem: {
    marginBottom: 24,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#e5e7eb',
  },
  meaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  meaningNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  meaningSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  difficultyBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '500',
  },
  meaningText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 12,
  },
  examplesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  tagText: {
    fontSize: 14,
    color: '#1e40af',
  },
  etymologyText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
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

