import api from './api';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post(`${API_CONFIG.ENDPOINTS.USER}/login`, {
        email,
        password,
      });
      
      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        // Fetch user profile to get full user data
        const profile = await authService.getProfile(response.token);
        if (profile) {
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile.user));
        }
        return { success: true, token: response.token, user: profile?.user };
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register
  register: async (email, fullName, password, confirmPassword) => {
    try {
      const response = await api.post(`${API_CONFIG.ENDPOINTS.USER}/register`, {
        email,
        fullName,
        password,
        confirmPassword,
      });
      
      if (response.token) {
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        if (response.user) {
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
        return { success: true, token: response.token, user: response.user };
      }
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async (token = null) => {
    try {
      const storedToken = token || await AsyncStorage.getItem(TOKEN_KEY);
      if (!storedToken) return null;

      // Use api.get which automatically adds auth headers
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USER || '/user'}/profile`);
      
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Get stored token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },

  // Get stored user
  getStoredUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Check if logged in
  isAuthenticated: async () => {
    const token = await authService.getToken();
    return !!token;
  },
};

export default authService;

