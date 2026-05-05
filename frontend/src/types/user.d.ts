// src/types/user.ts

// 1. Définition stricte des rôles du système
export type UserRole = "CITIZEN" | "AGENT" | "ADMIN" | "SUPER_ADMIN";

// 2. Interface globale de l'utilisateur (Correspond au state Redux)
export interface User {
  id: string | null;          // L'UID Firebase
  nni: string | null;         // Numéro National d'Identification (Crucial)
  name: string;               // Nom complet (Nom + Prénoms)
  email: string;
  role: UserRole | null;      // Détermine les accès aux pages
  structureId: string | null; // Code de la structure de rattachement (pour les agents)
  isLoggedIn: boolean;        // État de la session
  isAuthReady: boolean;       // Indique si Firebase a fini de vérifier le token au chargement
}

// 3. Payload attendu lors de l'action de connexion
export interface LoginPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nni?: string;               // Optionnel selon le rôle
  structureId?: string;       // Optionnel (uniquement pour les agents)
}

// 4. Payload pour la mise à jour du profil
export interface UpdateUserProfilePayload {
  name?: string;
  email?: string;
  nni?: string;
}