import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const eventService = {
  getEvents: async (params = {}) => {
    const response = await axios.get(`${API_BASE_URL}/events`, { params });
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/events/${eventId}/register`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default eventService;
