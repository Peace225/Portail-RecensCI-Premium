// src/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration récupérée depuis votre console Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDudiiXbHDJzSX2hp93Uxxqqs7bsLzwcyI",
  authDomain: "recensci.firebaseapp.com",
  projectId: "recensci",
  storageBucket: "recensci.firebasestorage.app",
  messagingSenderId: "386929437202",
  appId: "1:386929437202:web:fd6b634a015fbbbded06cb",
  measurementId: "G-R808TVSSH6"
};

// 1. Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// 2. Initialisation et Export des services
// C'est cet export 'auth' qui va corriger votre erreur actuelle
export const auth = getAuth(app);

// On export 'db' car nous en aurons besoin pour stocker les actes d'état civil
export const db = getFirestore(app);

export default app;