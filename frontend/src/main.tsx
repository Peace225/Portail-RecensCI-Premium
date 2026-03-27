// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store, persistor } from "./store";
import App from "./App";
import Loader from "./components/Loader";

// Styles
import "./index.css";
import 'leaflet/dist/leaflet.css';

// 1. Initialisation du QueryClient (Le moteur de cache)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Les données restent "fraîches" 5 minutes
      gcTime: 1000 * 60 * 30,    // Garde en mémoire (Garbage Collection) pendant 30 min
      retry: 1,                 // Réessaie une fois en cas d'échec
      refetchOnWindowFocus: false, 
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2. Provider Redux : Gère ton état global (Auth, UI légère) */}
    <Provider store={store}>
      {/* 3. PersistGate : Attend que le stockage local soit lu avant de lancer l'App */}
      <PersistGate 
        loading={<Loader fullScreen text="Initialisation du Noyau..." />} 
        persistor={persistor}
      >
        {/* 4. QueryClientProvider : Gère tes requêtes API et le cache Supabase */}
        <QueryClientProvider client={queryClient}>
          <App />
          
          {/* Outil de debug pour voir ton cache (uniquement visible en développement) */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);