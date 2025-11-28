import api from './api';
import { API_CONFIG } from '../config/api';

export const wordService = {
  // Get all words with filters
  getWords: async (params = {}) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.WORDS, params);
    } catch (error) {
      console.error('Error fetching words:', error);
      throw error;
    }
  },

  // Get single word by word text
  getWord: async (word, difficulty = null) => {
    try {
      const encodedWord = encodeURIComponent(word);
      const params = difficulty ? { difficulty } : {};
      return await api.get(`${API_CONFIG.ENDPOINTS.WORDS}/${encodedWord}`, params);
    } catch (error) {
      console.error('Error fetching word:', error);
      throw error;
    }
  },

  // Get random word
  getRandomWord: async () => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.WORDS}/random`);
      return response;
    } catch (error) {
      console.error('Error fetching random word:', error);
      throw error;
    }
  },

  // Get word of the day
  getWordOfTheDay: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.WORD_OF_THE_DAY);
      // Handle both response formats: { success: true, data: word, word: word } or direct word
      return response.data || response.word || response;
    } catch (error) {
      console.error('Error fetching word of the day:', error);
      throw error;
    }
  },
};

export default wordService;

