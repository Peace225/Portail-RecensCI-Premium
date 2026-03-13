// src/hooks/useBackofficeAuth.ts
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

/**
 * Hook Gardien pour protéger les routes d'administration.
 * @param allowedRoles Liste des rôles autorisés (par défaut : ADMIN et SUPER_ADMIN)
 */
const useBackofficeAuth = (allowedRoles: UserRole[] = ["ADMIN", "SUPER_ADMIN"]) => {
  // On s'appuie sur notre source de vérité (Firebase + Redux)
  const { user, loading, isLoggedIn, role } = useAuth();

  // Vérification stricte des droits
  const isAuthorized = isLoggedIn && role !== null && allowedRoles.includes(role);

  // Détection des tentatives d'accès frauduleuses (connecté, mais sans les bons droits)
  const isForbidden = isLoggedIn && !loading && !isAuthorized;

  return { 
    user, 
    loading, 
    isAuthorized,
    isForbidden,
    role 
  };
};

export default useBackofficeAuth;