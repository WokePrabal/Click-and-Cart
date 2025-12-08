// // frontend/src/api/axios.js
// import axios from 'axios';

// // Priority: VITE_API_BASE_URL → fallback localhost
// const baseURL =
//   import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL,
//   withCredentials: true
// });

// export default api;


// new code 



// import axios from 'axios';

// const base = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

// const api = axios.create({
//   baseURL: base,
//   headers: { 'Content-Type': 'application/json' }
// });

// export default api;

// another code



// frontend/src/api/axios.js
import axios from 'axios';

// create instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // adjust according to your env setup
  // do not set default Authorization here; use interceptor to read latest token
});

// Attach token from localStorage for each request (safer than relying on a copied default header)
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user && user.token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      // ignore parse error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: global response interceptor to handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local auth and reload/redirect to login
      try { localStorage.removeItem('user'); } catch (e) {}
      // If you want to redirect immediately:
      if (typeof window !== 'undefined') {
        // keep a small delay so code that triggered the request can finish
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// last 

