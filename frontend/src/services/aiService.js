import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const aiService = {
  askAI: async (question) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/ai/ask`, { question }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default aiService;
