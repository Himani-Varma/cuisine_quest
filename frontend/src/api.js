import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {},
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const recipeAPI = {
  getAllRecipes: (params) => api.get('/recipes', { params }),
  getRecipeById: (id) => api.get(`/recipes/${id}`),
  getUserRecipes: (userId) => api.get(`/recipes/user/${userId}`),
  getTrendingRecipes: () => api.get('/recipes/trending'),
  getRecentRecipes: () => api.get('/recipes/recent'),
  getTopRatedRecipes: () => api.get('/recipes/toprated'),
  createRecipe: (data) => api.post('/recipes', data),
  updateRecipe: (id, data) => api.put(`/recipes/${id}`, data),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  likeRecipe: (id) => api.post(`/recipes/${id}/like`),
  addToFavorites: (id) => api.post(`/recipes/${id}/favorite`),
};

export const commentAPI = {
  addComment: (recipeId, data) => api.post(`/comments/${recipeId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export default api;
