import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debug logs (you can remove these later)
console.log('🔗 API URL:', API_URL);
console.log('🔗 Environment:', import.meta.env.MODE);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Movies API
export const moviesAPI = {
  getTrending: () => api.get('/movies/trending'),
  getPopularMovies: (page = 1) => api.get(`/movies/popular/movies?page=${page}`),
  getPopularTV: (page = 1) => api.get(`/movies/popular/tv?page=${page}`),
  getNowPlaying: (page = 1) => api.get(`/movies/now-playing?page=${page}`),
  getDetails: (id, type = 'movie') => api.get(`/movies/${id}?type=${type}`),
  search: (query, page = 1) => api.get(`/movies/search?query=${query}&page=${page}`),
  discover: (type = 'movie', genre, page = 1) => {
    let url = `/movies/discover?type=${type}&page=${page}`;
    if (genre) url += `&genre=${genre}`;
    return api.get(url);
  },
  getGenres: () => api.get('/movies/genres')
};

// Favorites API
export const favoritesAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (item) => api.post('/favorites', item),
  removeFavorite: (id) => api.delete(`/favorites/${id}`),
  checkFavorite: (tmdbId) => api.get(`/favorites/check/${tmdbId}`)
};

export default api;