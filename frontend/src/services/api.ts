import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
