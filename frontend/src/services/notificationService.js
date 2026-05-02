import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const notificationService = {
  getNotifications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  markAsRead: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default notificationService;
