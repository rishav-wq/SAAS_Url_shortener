// src/services/api.js
import axios from 'axios';

// Access Vite environment variable using import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // Default fallback

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = userInfo?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;