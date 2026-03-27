// src/backoffice/useBackofficeAuth.ts
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

/**
 * Hook Gardien pour protéger les routes d'administration.
 * @param allowedRoles Liste des rôles autorisés (par défaut : ADMIN et SUPER_ADMIN)
 */
const useBackofficeAuth = (allowedRoles: UserRole[] = ["ADMIN", "SUPER_ADMIN"]) => {
  // On récupère les informations de notre hook principal
  // loading correspond ici à 'isAuthReady' (l'état de synchronisation avec Supabase)
  const { user, loading, isLoggedIn, role } = useAuth();

  // 1. Vérification de l'autorisation :
  // Il faut être connecté ET avoir un rôle présent dans la liste blanche
  const isAuthorized = isLoggedIn && role !== null && allowedRoles.includes(role as UserRole);

  // 2. Détection d'accès interdit (Forbidden) :
  // L'utilisateur est connecté, le chargement est fini, mais il n'a pas le bon badge.
  // C'est ici qu'on peut déclencher une alerte de sécurité ou un log.
  const isForbidden = !loading && isLoggedIn && !isAuthorized;

  return { 
    user, 
    loading,      // Utile pour afficher un Loader spécifique au Backoffice
    isAuthorized, // Utilisé par le router pour laisser passer ou non
    isForbidden,  // Utilisé pour rediriger vers une page "Accès Refusé"
    role 
  };
};

export default useBackofficeAuth;