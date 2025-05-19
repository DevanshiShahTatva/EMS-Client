import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";
import { getAuthToken, Logout } from '../helper';
import { ROUTES } from '../constant';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

// Request Interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        if (typeof window !== 'undefined') {
            const token = getAuthToken();
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
            if (typeof window !== 'undefined') {
                // Remove auth token
                Logout();
                window.location.href = ROUTES.LOGIN;
            }
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
