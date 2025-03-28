// src/services/api.ts
import axios from 'axios';

// Create a base axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default api;