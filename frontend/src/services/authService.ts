// src/services/authService.ts
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  IdTokenResult
} from "firebase/auth";
// L'instance auth sera initialisée dans votre fichier firebaseConfig.ts
import { auth } from "../firebase/firebaseConfig"; 

// 1. Dictionnaire d'erreurs pour traduire les codes Firebase en messages citoyens
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Identifiants incorrects. Veuillez vérifier votre email et votre mot de passe.";
    case "auth/too-many-requests":
      return "Accès temporairement bloqué suite à de multiples tentatives échouées. Réessayez plus tard.";
    case "auth/network-request-failed":
      return "Erreur réseau. Veuillez vérifier votre connexion internet.";
    case "auth/user-disabled":
      return "Ce compte a été suspendu par l'administrateur système.";
    default:
      return "Une erreur inattendue est survenue lors de l'authentification.";
  }
};

export const authService = {
  /**
   * Connexion via Firebase Auth
   */
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  /**
   * Déconnexion sécurisée
   */
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      // Firebase nettoie automatiquement les tokens stockés localement
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      throw new Error("Impossible de fermer la session correctement.");
    }
  },

  /**
   * Récupère le Token JWT actuel (utile pour des requêtes manuelles si apiService n'est pas utilisé)
   * Firebase s'occupe de le rafraîchir s'il est expiré (durée de vie 1h)
   */
  getToken: async (forceRefresh = false): Promise<string | null> => {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(forceRefresh);
    }
    return null;
  },

  /**
   * Récupère les rôles de l'utilisateur (RBAC) via les Custom Claims de Firebase
   * (ex: { admin: true, role: "agent", region: "Cocody" })
   */
  getUserRoles: async (): Promise<IdTokenResult["claims"] | null> => {
    const user = auth.currentUser;
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims;
    }
    return null;
  },

  /**
   * Écouteur global pour suivre l'état de la connexion en temps réel
   * Indispensable pour React Context (useAuth)
   */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },
};