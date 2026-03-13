// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition stricte des rôles du système RecensCI
export type UserRole = "CITIZEN" | "AGENT" | "ADMIN" | "SUPER_ADMIN";

export interface UserState {
  id: string | null; // L'UID Firebase
  nni: string | null; // Numéro National d'Identification (Crucial pour les citoyens)
  name: string;
  email: string;
  role: UserRole | null;
  structureId: string | null; // Code de la structure de rattachement (ex: Mairie_Cocody)
  isLoggedIn: boolean;
  isAuthReady: boolean; // True quand Firebase a terminé de vérifier la session initiale
}

const initialState: UserState = {
  id: null,
  nni: null,
  name: "",
  email: "",
  role: null,
  structureId: null,
  isLoggedIn: false,
  isAuthReady: false, 
};

// Type pour le payload de connexion
interface LoginPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nni?: string;
  structureId?: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Appelée quand Firebase confirme que l'utilisateur est connecté et que ses Custom Claims (Rôles) sont lus
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.nni = action.payload.nni || null;
      state.structureId = action.payload.structureId || null;
      state.isLoggedIn = true;
      state.isAuthReady = true;
    },
    
    // Appelée lors de la déconnexion
    logout: (state) => {
      state.id = null;
      state.name = "";
      state.email = "";
      state.nni = null;
      state.role = null;
      state.structureId = null;
      state.isLoggedIn = false;
      state.isAuthReady = true; // L'auth est prête, on sait juste qu'il n'y a personne
    },
    
    // Appelée au démarrage de l'app si aucun utilisateur n'est trouvé en cache
    setAuthReady: (state) => {
      state.isAuthReady = true;
    },

    // Mise à jour du profil (ex: depuis l'espace citoyen)
    updateProfile: (state, action: PayloadAction<{ name?: string; email?: string }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
    },
  },
});

export const { login, logout, setAuthReady, updateProfile } = userSlice.actions;
export default userSlice.reducer;