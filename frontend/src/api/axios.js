import axios from 'axios';

// Use the production URL from environment variables,
// but fall back to the local URL for development.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
