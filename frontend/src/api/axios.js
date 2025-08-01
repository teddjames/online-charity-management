import axios from 'axios';

// The base URL for your LOCAL backend server
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// The base URL for your DEPLOYED backend on Render
// const API_BASE_URL = 'https://plsfundme-backend.onrender.com/api';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

/*
  This setup allows you to make requests to your local server.
  For example, to log in, you can now use:
  api.post('/auth/login', { email, password });

  The request will automatically go to:
  http://127.0.0.1:5000/api/auth/login
*/

// IMPORTANT: Remember to switch back to the Render URL before you deploy your frontend.

export default api;
