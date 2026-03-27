let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
baseURL = baseURL.replace(/\/$/, ""); 
if (!baseURL.endsWith('/api')) {
    baseURL += '/api';
}
export const API_URL = baseURL;
