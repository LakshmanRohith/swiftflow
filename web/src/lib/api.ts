// path: web/src/lib/api.ts

import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api', // Your backend API URL
// });
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: baseURL,
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor to handle 401 errors (e.g., token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // For example, redirect to login or refresh token
      localStorage.removeItem('token');
      // This will force the user to log in again
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
