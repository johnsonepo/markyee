import axios from "axios";

// Create an Axios instance with a base URL derived from environment variables
const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Log the constructed base URL for debugging purposes
console.log(`${import.meta.env.VITE_API_BASE_URL}/api`);

// Request interceptor to add Authorization header with JWT token if available
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized responses by redirecting to login page
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const { response } = error;
    if (response && response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default axiosClient;
