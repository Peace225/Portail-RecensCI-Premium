// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; 
import { store, persistor } from "./store";
import App from "./App";
import Loader from "./components/Loader";
import "./index.css";
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Le PersistGate empêche l'App de s'afficher tant que 
          les données locales n'ont pas été récupérées du disque */}
      <PersistGate loading={<Loader fullScreen text="Récupération de la base locale..." />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);