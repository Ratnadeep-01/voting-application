import axios from 'axios';

const api = axios.create({
    baseURL: 'https://voting-application-7io9.onrender.com',
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
