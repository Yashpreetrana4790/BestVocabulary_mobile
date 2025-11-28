import { Platform } from 'react-native';

// Use IP address for mobile devices, localhost for web
// Mobile devices can't access localhost - they need your computer's IP address
// Your computer's IP: 192.168.1.3 (update if it changes)
const getApiUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:8000/api/v1';
  }
  
  // For mobile (iOS/Android), use IP address
  return 'http://192.168.1.3:8000/api/v1';
};

const API_URL = getApiUrl();

export const API_CONFIG = {
  BASE_URL: API_URL,
  ENDPOINTS: {
    USER: '/user',
    WORDS: '/words',
    WORD: '/words',
    WORD_OF_THE_DAY: '/word-of-the-day',
    PHRASAL_VERBS: '/phrase',
    CATEGORIES: '/category',
    IDIOMS: '/idioms',
    HOMOPHONES: '/categories/homophones',
    HOMONYMS: '/categories/homonyms',
    CONFUSED_WORDS: '/categories/confused-words',
  },
  TIMEOUT: 30000,
};

export default API_CONFIG;

