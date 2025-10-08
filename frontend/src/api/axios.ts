import axios from 'axios'

// Base config
const api = axios.create({
    baseURL: (import.meta as any).env?.VITE_API_BASE || '/api/',
});

// Interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Pas de tentative de refresh pour les endpoints d'auth ou si pas déjà authentifié
        const url = originalRequest?.url || '';
        const isAuthEndpoint = url.includes('login/') || url.includes('register/') || url.includes('refresh/');
        const hasAccessToken = !!localStorage.getItem('access_token');

        if (error.response?.status === 401) {
            // Cas simple: échec login => on laisse passer l’erreur (pas de reload)
            if (isAuthEndpoint || !hasAccessToken) {
                return Promise.reject(error);
            }

            // Tentative refresh si possible
            if (!originalRequest._retry) {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // Session expirée sans refresh: on nettoie seulement
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    return Promise.reject(error);
                }

                try {
                    originalRequest._retry = true;
                    const response = await api.post('refresh/', { refresh: refreshToken });
                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;