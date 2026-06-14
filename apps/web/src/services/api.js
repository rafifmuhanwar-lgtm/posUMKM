import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

// Menggunakan VITE_API_URL agar bisa diatur manual lewat Environment Variables di Vercel
// Pastikan di Vercel, VITE_API_URL diset menjadi: /api/v1
// Di local (file .env), VITE_API_URL diset menjadi: http://localhost:3001/api/v1
const baseURL = import.meta.env.VITE_API_URL;

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
