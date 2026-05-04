import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const authService = {
  // Register
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      const data = response.data.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      const data = response.data.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => true
};

export default authService;
