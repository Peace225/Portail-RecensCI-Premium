// src/store/vitalEventSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types d'événements gérés par RecensCI
export type VitalEventType = "NAISSANCE" | "DECES" | "MARIAGE" | "DIVORCE" | "MIGRATION";
export type SyncStatus = "PENDING" | "SYNCING" | "SYNCED" | "ERROR";

// Interface stricte pour un événement d'état civil
export interface VitalEvent {
  id: string; // ID local (ex: généré par crypto.randomUUID() en mode hors-ligne)
  type: VitalEventType;
  status: SyncStatus;
  data: Record<string, any>; // Le contenu du formulaire (NNI parents, nom enfant, etc.)
  createdAt: string; // Date de saisie (ISO String)
  errorMessage?: string; // Raison de l'échec si le serveur le rejette (ex: "NNI invalide")
}

interface VitalEventState {
  offlineQueue: VitalEvent[]; // Événements en attente de réseau
  recentHistory: VitalEvent[]; // Historique récent affiché sur le Dashboard
  isSyncing: boolean; // État global pour afficher le Loader dans la Top Bar
}

const initialState: VitalEventState = {
  offlineQueue: [],
  recentHistory: [],
  isSyncing: false,
};

const vitalEventSlice = createSlice({
  name: "vitalEvents",
  initialState,
  reducers: {
    // 1. L'agent saisit un acte (hors-ligne ou en ligne)
    addToQueue: (state, action: PayloadAction<Omit<VitalEvent, "status">>) => {
      state.offlineQueue.push({
        ...action.payload,
        status: "PENDING",
      });
    },

    // 2. Début du processus de synchronisation (au retour du réseau)
    startSyncing: (state) => {
      state.isSyncing = true;
      state.offlineQueue = state.offlineQueue.map(event => 
        event.status === "PENDING" || event.status === "ERROR" 
          ? { ...event, status: "SYNCING" } 
          : event
      );
    },

    // 3. Succès de la synchronisation d'un acte spécifique
    syncEventSuccess: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      const eventIndex = state.offlineQueue.findIndex(e => e.id === eventId);
      
      if (eventIndex !== -1) {
        const syncedEvent = { ...state.offlineQueue[eventIndex], status: "SYNCED" as SyncStatus };
        // On le retire de la file d'attente
        state.offlineQueue.splice(eventIndex, 1);
        // On l'ajoute à l'historique récent (en haut de la liste)
        state.recentHistory.unshift(syncedEvent);
      }
    },

    // 4. Échec de la synchronisation (ex: Doublon détecté par le serveur)
    syncEventFailure: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const eventIndex = state.offlineQueue.findIndex(e => e.id === action.payload.id);
      if (eventIndex !== -1) {
        state.offlineQueue[eventIndex].status = "ERROR";
        state.offlineQueue[eventIndex].errorMessage = action.payload.error;
      }
    },

    // 5. Fin du processus global de synchronisation
    stopSyncing: (state) => {
      state.isSyncing = false;
    },

    // 6. L'agent supprime un brouillon erroné avant synchronisation
    removeOfflineDraft: (state, action: PayloadAction<string>) => {
      state.offlineQueue = state.offlineQueue.filter(event => event.id !== action.payload);
    },
  },
});

export const { 
  addToQueue, 
  startSyncing, 
  syncEventSuccess, 
  syncEventFailure, 
  stopSyncing, 
  removeOfflineDraft 
} = vitalEventSlice.actions;

export default vitalEventSlice.reducer;