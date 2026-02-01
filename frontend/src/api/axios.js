// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL
    : 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (_) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('user');
      } catch (_) {}
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
