import api from './api';
import { API_CONFIG } from '../config/api';

export const categoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.CATEGORIES, params);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      return await api.get(`${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Get homophones
  getHomophones: async (params = {}) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.HOMOPHONES, params);
    } catch (error) {
      console.error('Error fetching homophones:', error);
      throw error;
    }
  },

  // Get homonyms
  getHomonyms: async (params = {}) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.HOMONYMS, params);
    } catch (error) {
      console.error('Error fetching homonyms:', error);
      throw error;
    }
  },

  // Get confused words
  getConfusedWords: async (params = {}) => {
    try {
      return await api.get(API_CONFIG.ENDPOINTS.CONFUSED_WORDS, params);
    } catch (error) {
      console.error('Error fetching confused words:', error);
      throw error;
    }
  },
};

export default categoryService;

