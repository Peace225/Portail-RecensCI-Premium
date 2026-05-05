// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Définition stricte des rôles du système RecensCI
export type UserRole = "CITIZEN" | "AGENT" | "ADMIN" | "SUPER_ADMIN";

export interface UserState {
  id: string | null;         // L'UID Supabase (UUID)
  nni: string | null;        // Numéro National d'Identification
  name: string;
  email: string;
  photoUrl: string | null;   // URL de la photo Cloudinary
  role: UserRole | null;
  structureId: string | null; // Code de la structure (Mairie, ONECI...)
  isLoggedIn: boolean;
  isAuthReady: boolean;      // True quand Supabase a terminé la vérification initiale
}

const initialState: UserState = {
  id: null,
  nni: null,
  name: "",
  email: "",
  photoUrl: null,
  role: null,
  structureId: null,
  isLoggedIn: false,
  isAuthReady: false, 
};

// Interface pour le payload de connexion
interface LoginPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nni?: string;
  photoUrl?: string;
  structureId?: string;
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Appelée quand Supabase confirme la session et que le profil 'citizens' est chargé
    login: (state, action: PayloadAction<LoginPayload>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.nni = action.payload.nni || null;
      state.photoUrl = action.payload.photoUrl || null;
      state.structureId = action.payload.structureId || null;
      state.isLoggedIn = true;
      state.isAuthReady = true;
    },
    
    // Appelée lors de la déconnexion (supabase.auth.signOut)
    logout: (state) => {
      return { ...initialState, isAuthReady: true }; // Reset complet propre
    },
    
    // Bascule l'état de chargement initial
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.isAuthReady = action.payload;
    },

    // Mise à jour du profil en temps réel
    updateProfile: (state, action: PayloadAction<{ name?: string; email?: string; photoUrl?: string }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.photoUrl) state.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, setAuthReady, updateProfile } = userSlice.actions;
export default userSlice.reducer;