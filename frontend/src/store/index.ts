// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// On utilise localforage au lieu du storage par défaut (localStorage)
// car IndexedDB permet de stocker de gros volumes de données sans bloquer le navigateur
import localforage from "localforage"; 

import userReducer from "./userSlice";
import vitalEventReducer from "./vitalEventSlice"; // Notre nouveau slice

// 1. Configuration de la persistance (IndexedDB)
const persistConfig = {
  key: "recensci-agent-offline-store",
  storage: localforage,
  // On ne persiste QUE les événements vitaux. 
  // L'utilisateur (user) est déjà géré et persisté par Firebase Auth.
  whitelist: ["vitalEvents"], 
};

// 2. Combinaison des reducers
const rootReducer = combineReducers({
  user: userReducer,
  vitalEvents: vitalEventReducer,
});

// 3. Création du reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configuration du Store avec le Middleware adapté
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Toolkit est très strict sur les données non-sérialisables.
      // Il faut lui dire d'ignorer les actions internes de redux-persist 
      // pour éviter des erreurs rouges dans la console.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Création du Persistor (utilisé pour envelopper l'application dans main.tsx)
export const persistor = persistStore(store);

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;