import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const userService = {
  getLeaderboard: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/users/leaderboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getDepartmentLeaderboard: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/users/leaderboard/departments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getUserStats: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/users/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  toggleFriend: async (friendId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/users/friend/${friendId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getActivityFeed: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/users/activity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};


export default userService;
