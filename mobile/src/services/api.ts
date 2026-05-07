import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getDemoResponse } from './demoData';

// Pointe vers le backend NestJS — changer l'IP pour le device physique
export const API_BASE_URL = 'http://10.0.2.2:3000/v1'; // 10.0.2.2 = localhost depuis émulateur Android

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Intercepteur REQUEST ─────────────────────────────────────────────────────
// Si le token est un token démo → court-circuiter la requête et retourner
// des données fictives sans toucher au réseau.
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('recensci_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    // MODE DÉMO : token fictif → on injecte les données sans appel réseau
    if (token.startsWith('demo_token_')) {
      const method = (config.method || 'get').toUpperCase();
      const url = config.url || '';
      const demoData = getDemoResponse(method, url);

      // On lève une "erreur" spéciale que l'intercepteur response va intercepter
      // et transformer en réponse réussie
      const cancelToken = axios.CancelToken.source();
      config.cancelToken = cancelToken.token;
      cancelToken.cancel(JSON.stringify({ __demo: true, data: demoData }));
    }
  }

  return config;
});

// ─── Intercepteur RESPONSE ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Réponse démo simulée
    if (axios.isCancel(error)) {
      try {
        const payload = JSON.parse(error.message);
        if (payload.__demo) {
          // Simuler un délai réseau réaliste (300-600ms)
          await new Promise(r => setTimeout(r, 300 + Math.random() * 300));
          return { data: payload.data, status: 200, headers: {}, config: {} };
        }
      } catch {}
    }

    // Token expiré
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('recensci_token');
    }

    return Promise.reject(error);
  }
);

export default api;
