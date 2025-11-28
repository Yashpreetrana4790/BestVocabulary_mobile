import api from './api';
import { API_CONFIG } from '../config/api';

export const phrasalVerbService = {
  // Get all phrasal verbs
  getPhrasalVerbs: async (params = {}) => {
    try {
      return await api.get(`${API_CONFIG.ENDPOINTS.PHRASAL_VERBS}/allphrases`, params);
    } catch (error) {
      console.error('Error fetching phrasal verbs:', error);
      throw error;
    }
  },

  // Get single phrasal verb by ID
  getPhrasalVerb: async (id) => {
    try {
      return await api.get(`${API_CONFIG.ENDPOINTS.PHRASAL_VERBS}/phrase/${id}`);
    } catch (error) {
      console.error('Error fetching phrasal verb:', error);
      throw error;
    }
  },
};

export default phrasalVerbService;

