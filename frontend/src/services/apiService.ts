// src/services/apiService.ts
import { getAuth } from "firebase/auth"; // À adapter selon votre configuration Firebase

// L'URL de base dynamique selon l'environnement (Dev/Prod)
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.recensci.gouv.ci/v1";

// 1. Classe d'Erreur personnalisée pour formater les retours du Backend
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// 2. Fonction utilitaire pour générer les en-têtes (avec Token dynamique)
const getHeaders = async (customHeaders: Record<string, string> = {}) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  try {
    // Récupération automatique du token Firebase de l'utilisateur connecté
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      const token = await currentUser.getIdToken();
      headers.append("Authorization", `Bearer ${token}`);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token d'authentification", error);
  }

  return headers;
};

// 3. Fonction centrale pour traiter les réponses et les erreurs
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = "Une erreur inattendue est survenue.";
    let errorData = null;

    try {
      // Tente de lire le message d'erreur structuré renvoyé par le backend Node.js
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      errorData = errorBody.errors || null;
    } catch (e) {
      // Si la réponse n'est pas du JSON (ex: erreur 502 du serveur)
      errorMessage = response.statusText;
    }

    // Si l'utilisateur n'est plus autorisé, on pourrait déclencher une déconnexion forcée ici
    if (response.status === 401) {
      console.warn("Session expirée ou non autorisée.");
      // Déclenchement d'un événement global de déconnexion si nécessaire
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Gère les requêtes comme DELETE qui peuvent renvoyer un statut 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// 4. L'objet apiService fortement typé avec les Génériques (<T>)
export const apiService = {
  get: async <T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> => {
    const headers = await getHeaders(customHeaders);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
    return handleResponse<T>(response);
  },
};