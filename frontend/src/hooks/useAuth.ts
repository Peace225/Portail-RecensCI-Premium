// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { login, logout, setAuthReady } from "../store/userSlice";
import { authService } from "../services/authService";
import { UserRole } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // On lit l'état global depuis Redux (notre source de vérité unique)
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // 1. On s'abonne en temps réel aux changements de session Firebase
    // Dès que l'app s'ouvre, Firebase vérifie s'il y a un token valide en cache
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 2. L'utilisateur est connecté, on récupère ses habilitations (Custom Claims)
          const claims = await authService.getUserRoles();

          // 3. On met à jour le store Redux avec les données sécurisées
          dispatch(
            login({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "Utilisateur",
              email: firebaseUser.email || "",
              role: (claims?.role as UserRole) || "CITIZEN", // Citoyen par défaut si aucun rôle admin
              nni: claims?.nni as string | undefined,
              structureId: claims?.structureId as string | undefined,
            })
          );
        } catch (error) {
          console.error("Erreur lors de la lecture des habilitations", error);
          dispatch(logout()); // Sécurité stricte : en cas de doute, on déconnecte
        }
      } else {
        // 4. Aucun utilisateur connecté (ou token expiré)
        dispatch(logout());
      }
    });

    // 5. Nettoyage de l'écouteur Firebase quand le composant est démonté
    return () => unsubscribe();
  }, [dispatch]);

  // Fonction de déconnexion exposée aux composants (ex: pour le Sidebar)
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Note : Firebase va détecter la déconnexion et déclencher onAuthStateChange,
      // ce qui appellera dispatch(logout()) automatiquement.
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return {
    user: userState.isLoggedIn ? userState : null,
    loading: !userState.isAuthReady, // Vrai tant que Firebase n'a pas répondu initialement
    isLoggedIn: userState.isLoggedIn,
    role: userState.role,
    logout: handleLogout,
  };
};