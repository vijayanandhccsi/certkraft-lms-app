
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  // In production (VPS), we use relative path '/api' so Nginx proxies it to the backend port.
  // In local development, we might point to localhost:3000 explicitly if not using a proxy.
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('ck_auth_token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login, clear token)
      localStorage.removeItem('ck_auth_token');
      // Optional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
