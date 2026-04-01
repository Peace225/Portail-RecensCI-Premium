// src/services/apiService.ts
// Connecté au backend NestJS local (http://localhost:3000/v1)

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/v1";
const TOKEN_KEY = "recensci_token";

// ─── TOKEN HELPERS ────────────────────────────────────────────────────────────

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── ERREUR PERSONNALISÉE ─────────────────────────────────────────────────────

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

// ─── HEADERS ─────────────────────────────────────────────────────────────────

const getHeaders = (customHeaders: Record<string, string> = {}): Headers => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  const token = tokenStorage.get();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
};

// ─── RESPONSE HANDLER ────────────────────────────────────────────────────────

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = "Une erreur inattendue est survenue.";
    let errorData = null;

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      errorData = errorBody.errors || null;
    } catch {
      errorMessage = response.statusText;
    }

    if (response.status === 401) {
      // Token expiré → déconnexion automatique
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  if (response.status === 204) return {} as T;

  return response.json();
};

// ─── API SERVICE ──────────────────────────────────────────────────────────────

export const apiService = {
  get: async <T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(customHeaders),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(endpoint: string, data: any, customHeaders?: Record<string, string>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(customHeaders),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(customHeaders),
    });
    return handleResponse<T>(response);
  },
};
