import axios from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import Config from '@/config';

const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const newConfig = { ...config };
    newConfig.headers.Accept = 'application/json';
    const token = localStorage.getItem('token');

    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }

    return newConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('No authorization');
    }
    if (error.response?.status === 500) {
      console.log('Server error');
    }
    return Promise.reject(error);
  }
);

export default api;