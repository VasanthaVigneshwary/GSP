import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const clubService = {
  getClubs: async () => {
    const response = await axios.get(`${API_BASE_URL}/clubs`);
    return response.data;
  },

  createClub: async (clubData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/clubs`, clubData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  joinClub: async (clubId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/clubs/${clubId}/join`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  leaveClub: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/clubs/leave`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default clubService;
