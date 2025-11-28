import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { wordService } from '../services/wordService';
import Navbar from '../components/Navbar';

const { width } = Dimensions.get('window');

const getDifficultyStyle = (difficulty) => {
  if (!difficulty) return { backgroundColor: '#64748b20', borderColor: '#64748b' };
  const lower = difficulty.toLowerCase();
  if (lower === 'beginner' || lower === 'easy') {
    return { backgroundColor: '#10b98120', borderColor: '#10b981' };
  }
  if (lower === 'intermediate' || lower === 'medium') {
    return { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' };
  }
  if (lower === 'advanced' || lower === 'hard') {
    return { backgroundColor: '#ef444420', borderColor: '#ef4444' };
  }
  return { backgroundColor: '#6366f120', borderColor: '#6366f1' };
};

export default function HomeScreen({ navigation }) {
  const [randomWord, setRandomWord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomWord();
  }, []);

  const loadRandomWord = async () => {
    try {
      setLoading(true);
      // First try to get word of the day, fallback to random word
      try {
        const response = await wordService.getWordOfTheDay();
        if (response) {
          setRandomWord(response);
          return;
        }
      } catch (wodError) {
        console.log('Word of the day not available, using random word:', wodError);
      }
      
      // Fallback to random word
      const response = await wordService.getRandomWord();
      if (response) {
        setRandomWord(response.word || response);
      }
    } catch (error) {
      console.error('Error loading word:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWordImage = () => {
    const searchTerm = randomWord?.word || 'dictionary';
    return `https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)},words,education,books`;
  };

  const primaryMeaning = randomWord?.meanings?.[0];
  const pronunciation = randomWord?.pronunciation || primaryMeaning?.pronunciation;
  const meaning = primaryMeaning?.meaning || primaryMeaning?.easyMeaning || primaryMeaning?.kiddefinition;
  const partOfSpeech = primaryMeaning?.pos;
  const difficulty = primaryMeaning?.difficulty || randomWord?.frequency;

  return (
    <View style={styles.container}>
      <Navbar title="Best Vocabulary" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Header with Gradient */}
        <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.heroTitle}>Expand Your Vocabulary</Text>
          <Text style={styles.heroSubtitle}>Learn new words every day</Text>
        </View>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </LinearGradient>

      {/* Word of the Day Card */}
      <View style={styles.wordOfDaySection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="sparkles" size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Word of the Day</Text>
          </View>
          <TouchableOpacity onPress={loadRandomWord} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={18} color="#6366f1" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Discovering a new word...</Text>
          </View>
        ) : randomWord ? (
          <TouchableOpacity
            style={styles.wordCard}
            onPress={() =>
              navigation.navigate('Dictionary', {
                screen: 'WordDetail',
                params: { word: randomWord.word },
              })
            }
            activeOpacity={0.9}
          >
            {/* Word Image Background */}
            <Image
              source={{ uri: getWordImage() }}
              style={styles.wordCardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.wordCardGradient}
            />

            {/* Word Content */}
            <View style={styles.wordCardContent}>
              <View style={styles.wordHeader}>
                <View style={styles.wordMain}>
                  <Text style={styles.wordText}>{randomWord.word}</Text>
                  {pronunciation && (
                    <View style={styles.pronunciationContainer}>
                      <Ionicons name="volume-medium" size={16} color="#e2e8f0" />
                      <Text style={styles.wordPronunciation}>{pronunciation}</Text>
                    </View>
                  )}
                </View>
                {difficulty && (
                  <View style={[styles.difficultyBadge, getDifficultyStyle(difficulty)]}>
                    <Text style={styles.difficultyText}>{difficulty}</Text>
                  </View>
                )}
              </View>

              {partOfSpeech && (
                <View style={styles.posTag}>
                  <Text style={styles.posText}>{partOfSpeech}</Text>
                </View>
              )}

              {meaning && (
                <Text style={styles.wordMeaning} numberOfLines={3}>
                  {meaning}
                </Text>
              )}

              <View style={styles.exploreRow}>
                <Text style={styles.exploreText}>Explore word →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={48} color="#94a3b8" />
            <Text style={styles.errorText}>No word available</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadRandomWord}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Dictionary')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="book" size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>Dictionary</Text>
              <Text style={styles.actionDescription}>Browse all words</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Categories')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="grid" size={32} color="#fff" />
              </View>
              <Text style={styles.actionTitle}>Categories</Text>
              <Text style={styles.actionDescription}>Explore by topic</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="library-outline" size={24} color="#6366f1" />
            <Text style={styles.statNumber}>1000+</Text>
            <Text style={styles.statLabel}>Words</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bookmark-outline" size={24} color="#10b981" />
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={24} color="#f59e0b" />
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    left: -30,
  },
  heroContent: {
    zIndex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e7ff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  wordOfDaySection: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  wordCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 320,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  wordCardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  wordCardGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  wordCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  wordMain: {
    flex: 1,
  },
  wordText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textTransform: 'capitalize',
    letterSpacing: -1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pronunciationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordPronunciation: {
    fontSize: 16,
    color: '#e2e8f0',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  posTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  posText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wordMeaning: {
    fontSize: 16,
    color: '#f1f5f9',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  quickActionsSection: {
    padding: 24,
    paddingTop: 0,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionGradient: {
    padding: 24,
    minHeight: 140,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  actionDescription: {
    fontSize: 14,
    color: '#e0e7ff',
    fontWeight: '500',
    marginBottom: 12,
  },
  actionArrow: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  statsSection: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 40,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
