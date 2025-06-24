// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para responses
api.interceptors.response.use(
    (response) => {
        console.log(`✅ Response ${response.status}:`, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error);

        // Tratamento centralizado de erros
        const errorMessage = error.response?.data?.message ||
            error.message ||
            'Erro interno do servidor';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export default api;