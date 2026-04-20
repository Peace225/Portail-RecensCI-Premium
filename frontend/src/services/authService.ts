// src/services/authService.ts
import { apiService, tokenStorage } from "./apiService";

export const authService = {
  /**
   * Connexion via NestJS backend
   */
  signIn: async (email: string, password: string): Promise<any> => {
    const data: any = await apiService.post("/auth/login", { email, password });
    if (data?.access_token) {
      tokenStorage.set(data.access_token);
    }
    return data;
  },

  /**
   * Déconnexion — supprime le token local
   */
  signOut: (): void => {
    tokenStorage.clear();
  },

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  getCurrentUser: async (): Promise<any> => {
    return apiService.get("/auth/me");
  },
};
