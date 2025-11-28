import api from './api';
import { API_CONFIG } from '../config/api';

export const idiomService = {
  // Get all idioms
  getIdioms: async (params = {}) => {
    try {
      return await api.get(`${API_CONFIG.ENDPOINTS.IDIOMS}/allidioms`, params);
    } catch (error) {
      console.error('Error fetching idioms:', error);
      throw error;
    }
  },

  // Get single idiom by ID
  getIdiom: async (id) => {
    try {
      return await api.get(`${API_CONFIG.ENDPOINTS.IDIOMS}/idiom/${id}`);
    } catch (error) {
      console.error('Error fetching idiom:', error);
      throw error;
    }
  },
};

export default idiomService;

