// src/store/vitalEventSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VitalEvent } from "../types";

interface VitalEventState {
  offlineQueue: VitalEvent[]; // Actes en attente de synchronisation
  history: VitalEvent[];      // Actes déjà synchronisés avec succès
  isSyncing: boolean;         // État visuel du moteur de synchro
}

const initialState: VitalEventState = {
  offlineQueue: [],
  history: [],
  isSyncing: false,
};

const vitalEventSlice = createSlice({
  name: "vitalEvents",
  initialState,
  reducers: {
    // 1. Ajouter un nouvel acte (Naissances/Décès) dans la file d'attente
    addEventToQueue: (state, action: PayloadAction<VitalEvent>) => {
      state.offlineQueue.push(action.payload);
    },

    // 2. Marquer le début de la synchronisation (active les loaders)
    startSyncing: (state) => {
      state.isSyncing = true;
    },

    // 3. Succès : L'acte passe de la file d'attente à l'historique
    syncEventSuccess: (state, action: PayloadAction<string>) => {
      const eventIndex = state.offlineQueue.findIndex(e => e.id === action.payload);
      if (eventIndex !== -1) {
        const [event] = state.offlineQueue.splice(eventIndex, 1);
        event.status = "SYNCED";
        state.history.unshift(event); // On l'ajoute en haut de l'historique
      }
    },

    // 4. Échec : L'acte reste dans la file mais avec une erreur
    syncEventFailure: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const event = state.offlineQueue.find(e => e.id === action.payload.id);
      if (event) {
        event.status = "ERROR";
        event.errorMessage = action.payload.error;
      }
    },

    // 5. Fin du cycle de synchronisation
    stopSyncing: (state) => {
      state.isSyncing = false;
    },

    // 6. Nettoyer un acte en erreur (pour correction manuelle par l'agent)
    removeEventFromQueue: (state, action: PayloadAction<string>) => {
      state.offlineQueue = state.offlineQueue.filter(e => e.id !== action.payload);
    }
  },
});

export const { 
  addEventToQueue, 
  startSyncing, 
  syncEventSuccess, 
  syncEventFailure, 
  stopSyncing,
  removeEventFromQueue
} = vitalEventSlice.actions;

export default vitalEventSlice.reducer;