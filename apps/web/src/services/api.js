import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Paksakan menggunakan '/api/v1' jika di production (Vercel)
// abaikan VITE_API_URL untuk menghindari salah konfigurasi di Vercel.
// Di local, gunakan VITE_API_URL atau fallback ke localhost.
const baseURL = import.meta.env.PROD 
  ? '/api/v1' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors like 401
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
