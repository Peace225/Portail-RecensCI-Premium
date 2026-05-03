import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Pointe vers le backend NestJS — changer l'IP pour le device physique
export const API_BASE_URL = 'http://10.0.2.2:3000/v1'; // 10.0.2.2 = localhost depuis émulateur Android

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Injecter le token JWT automatiquement
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('recensci_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les 401 (token expiré)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('recensci_token');
    }
    return Promise.reject(error);
  }
);

export default api;
