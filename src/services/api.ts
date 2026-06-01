import axios from 'axios';
import { Platform } from 'react-native';
import Config from '@/config';

const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 5000,
});

// Helper function to safely fetch the token across platforms and libraries
const getSessionToken = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      // Look for 'session' first, then 'token'
      let token = localStorage.getItem('session') || localStorage.getItem('token');
      
      if (!token) return null;

      // Crucial: Expo's useStorageState stringifies arrays on web sometimes (e.g. ["my-token"])
      if (token.startsWith('[') && token.endsWith(']')) {
        try {
          const parsed = JSON.parse(token);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0]; // Extract token out of the Expo Router state array wrapper
          }
        } catch {
          // Fallback if parsing fails
        }
      }
      return token;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return null;
    }
  } else {
    // Mobile implementation
    try {
      // 1. Try Expo SecureStore first (This is what the Expo Auth doc uses by default!)
      const SecureStore = await import('expo-secure-store');
      let token = await SecureStore.getItemAsync('session') || await SecureStore.getItemAsync('token');
      
      // 2. Fallback to AsyncStorage if SecureStore was empty
      if (!token) {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        token = await AsyncStorage.getItem('session') || await AsyncStorage.getItem('token');
      }

      return token;
    } catch (e) {
      console.error('Error reading native storage layers', e);
      return null;
    }
  }
};

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    // Standard secure header mutation pattern
    const token = await getSessionToken();

    if (token) {
      // Clean up stringified wrapping quotes if any
      const cleanToken = token.replace(/^"|"$/g, '').trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
    } else {
      console.warn("API Interceptor Warning: No authorization token found in device storage!");
    }

    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('No authorization - Token expired or invalid');
    }
    if (error.response?.status === 500) {
      console.log('Server error');
    }
    return Promise.reject(error);
  }
);

export default api;
