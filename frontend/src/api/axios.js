import axios from 'axios';

// This now points directly to your live backend on Render.
const API_BASE_URL = 'https://online-charity-management-tpy8.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
