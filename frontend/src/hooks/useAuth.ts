// src/hooks/useAuth.ts
// Auth via NestJS backend (JWT local)
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { login, logout, setAuthReady } from "../store/userSlice";
import { apiService, tokenStorage } from "../services/apiService";
import { UserRole } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Vérifie si un token existe au chargement et récupère le profil
    const checkSession = async () => {
      const token = tokenStorage.get();
      if (!token) {
        dispatch(logout());
        dispatch(setAuthReady(true));
        return;
      }

      try {
        const profile: any = await apiService.get("/auth/me");
        dispatch(
          login({
            id: profile.id,
            name: profile.fullName || profile.full_name || profile.email,
            email: profile.email || "",
            role: (profile.role || "CITIZEN") as UserRole,
            nni: profile.nni || undefined,
            photoUrl: profile.photoUrl || profile.photo_url || undefined,
            structureId: profile.institutionId || profile.institution_id || undefined,
          })
        );
      } catch {
        // Token invalide ou expiré
        tokenStorage.clear();
        dispatch(logout());
      } finally {
        dispatch(setAuthReady(true));
      }
    };

    checkSession();

    // Écoute l'événement de déconnexion forcée (token 401)
    const onForceLogout = () => dispatch(logout());
    window.addEventListener("auth:logout", onForceLogout);
    return () => window.removeEventListener("auth:logout", onForceLogout);
  }, [dispatch]);

  const handleLogout = () => {
    tokenStorage.clear();
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout());
  };

  return {
    user: userState.isLoggedIn ? userState : null,
    loading: !userState.isAuthReady,
    isLoggedIn: userState.isLoggedIn,
    role: userState.role,
    logout: handleLogout,
  };
};
