// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://click-and-cart-1.onrender.com'
    : 'http://localhost:5000',
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
