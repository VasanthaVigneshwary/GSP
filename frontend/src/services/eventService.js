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

  toggleSaveEvent: async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/events/${eventId}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getSavedEvents: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/events/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  
  checkIn: async (qrCode) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/events/check-in`,
      { qrCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  createEvent: async (eventData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  cancelRegistration: async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/events/${eventId}/register`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};




export default eventService;
