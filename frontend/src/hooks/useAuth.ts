// src/hooks/useAuth.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { login, logout, setAuthReady } from "../store/userSlice";
import { supabase } from "../supabaseClient"; 
import { UserRole } from "../types";

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // On lit l'état global depuis Redux
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // 1. Vérification initiale de la session au chargement
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleAuthChange(session);
      } else {
        dispatch(logout());
        dispatch(setAuthReady(true)); // Le système est prêt, même si personne n'est connecté
      }
    };

    checkInitialSession();

    // 2. Abonnement en temps réel aux changements Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await handleAuthChange(session);
      } else {
        dispatch(logout());
      }
      dispatch(setAuthReady(true));
    });

    // 3. LA FONCTION CORRIGÉE : Double vérification (Profiles puis Citizens)
    async function handleAuthChange(session: any) {
      try {
        const user = session.user;
        
        let finalRole = "CITIZEN";
        let finalName = user.email?.split('@')[0] || "Citoyen";
        let finalNni = undefined;
        let finalPhoto = undefined;

        // ÉTAPE A : On cherche d'abord si c'est un membre du personnel (Maire, Police, Agent)
        const { data: adminProfile, error: adminError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (adminProfile && adminProfile.role) {
          // BINGO ! C'est un officiel de l'état.
          finalRole = adminProfile.role;
          finalName = adminProfile.full_name || finalName;
        } 
        else {
          // ÉTAPE B : Ce n'est pas un officiel. On cherche si c'est un citoyen normal.
          const { data: citizenProfile, error: citizenError } = await supabase
            .from('citizens')
            .select('*')
            .eq('id', user.id)
            .single();

          if (citizenProfile) {
            finalRole = citizenProfile.role || "CITIZEN";
            finalName = `${citizenProfile.prenoms} ${citizenProfile.nom}`;
            finalNni = citizenProfile.nni;
            finalPhoto = citizenProfile.photo_url;
          }
        }

        // On envoie le VRAI rôle à Redux !
        dispatch(
          login({
            id: user.id,
            name: finalName,
            email: user.email || "",
            role: finalRole as UserRole, // Redux va enfin recevoir "ENTITY_ADMIN"
            nni: finalNni,
            photoUrl: finalPhoto, 
          })
        );
      } catch (error) {
        console.error("Erreur lors de la synchronisation du profil", error);
        dispatch(logout());
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  // --- LA FONCTION DE DÉCONNEXION BLINDÉE ---
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erreur réseau lors de la déconnexion :", error);
    } finally {
      dispatch(logout());
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  return {
    user: userState.isLoggedIn ? userState : null,
    loading: !userState.isAuthReady, 
    isLoggedIn: userState.isLoggedIn,
    role: userState.role,
    logout: handleLogout,
  };
};