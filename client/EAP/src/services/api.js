import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // Adjust if your backend runs on different port
});

// Add request interceptor to include token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  try {
    const response = await API.post('/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// export const login = async (userData) => {
//   try {
//     const response = await API.post('/login', userData);
//     localStorage.setItem('token', response.data.token);
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };
export const login = async (userData) => {
    try {
      const response = await API.post('/login', userData);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };