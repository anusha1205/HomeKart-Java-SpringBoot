import axios from 'axios';

const instance = axios.create({
  baseURL: '/api', // 🔥 Automatically attaches /api prefix
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
