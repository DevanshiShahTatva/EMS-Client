import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000, // Optional: 10-second timeout for all requests
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add Authorization token if available in localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
      if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle timeout error
        if (error.code === 'ECONNABORTED') {
            console.warn('Request timed out!');
    }

    // Handle unauthorized error (401)
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login");
    }

    if (error.response?.status === 404) {
      toast.error(error.response.data.message);
    }

    if (error.response?.status === 400) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;
