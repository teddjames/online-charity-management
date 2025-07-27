import axios from 'axios';

// The base URL of your deployed backend on Render
const API_BASE_URL = 'https://plsfundme-backend.onrender.com/api';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

/*
  This setup allows you to make requests without typing the full URL every time.
  For example, to log in, you can now use:
  api.post('/auth/login', { email, password });

  The request will automatically go to:
  https://plsfundme-backend.onrender.com/api/auth/login
*/

// You can also add interceptors here to automatically attach the JWT token
// to every authenticated request, which is a very common pattern.

export default api;
