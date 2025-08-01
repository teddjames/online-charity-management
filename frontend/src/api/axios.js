import axios from 'axios';

// Use the local backend URL for development
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Create an Axios instance with the correct base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

/*
  This setup will now correctly send requests to your local backend.
  For example, api.post('/auth/login', ...) will go to:
  http://127.0.0.1:5000/api/auth/login
*/

export default api;
