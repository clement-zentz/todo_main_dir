// frontend/todo_front/src/api/axios.ts
import axios from 'axios'

// Base config
const api = axios.create({
    // URL API DRF
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor to add JWT token to each request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
);

// Interceptor to manage 401 errors (token expired)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://127.0.0.1:8000/api/refresh/', {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    // Try again the original request
                    return api(originalRequest);
                } catch (refreshError) {
                    // Redirect to login page if refresh fail
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;