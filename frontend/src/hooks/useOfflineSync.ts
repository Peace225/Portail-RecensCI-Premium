// src/hooks/useOfflineSync.ts
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { 
  startSyncing, 
  stopSyncing, 
  syncEventSuccess, 
  syncEventFailure 
} from "../store/vitalEventSlice";
import { apiService } from "../services/apiService";
import { notify } from "../services/notificationService";

export const useOfflineSync = () => {
  const dispatch = useDispatch();
  
  // On récupère la file d'attente et l'état de synchronisation depuis notre store Redux
  const { offlineQueue, isSyncing } = useSelector((state: RootState) => state.vitalEvents);

  // Fonction centrale qui traite la file d'attente
  const synchronize = useCallback(async () => {
    // 1. Garde-fous : S'il n'y a rien à synchroniser, qu'on n'est pas en ligne, ou qu'une synchro est déjà en cours
    if (offlineQueue.length === 0 || !navigator.onLine || isSyncing) {
      return;
    }

    // 2. On verrouille l'état global (déclenche le Loader dans la Top Bar)
    dispatch(startSyncing());
    const toastId = notify.loading(`Synchronisation de ${offlineQueue.length} acte(s) en cours...`);

    let successCount = 0;
    let errorCount = 0;

    // 3. Traitement séquentiel pour ne pas surcharger les connexions rurales faibles
    for (const event of offlineQueue) {
      // On ignore les événements déjà marqués en erreur fatale (nécessitent une correction manuelle)
      if (event.status === "ERROR") continue;

      try {
        // Envoi sécurisé vers l'API Node.js (qui vérifiera les rôles via le JWT)
        // L'endpoint dépend du type d'événement (ex: /actes/naissance)
        const endpoint = `/actes/${event.type.toLowerCase()}`;
        
        await apiService.post(endpoint, event);
        
        // Succès : l'acte est retiré de la file d'attente et passe dans l'historique
        dispatch(syncEventSuccess(event.id));
        successCount++;
      } catch (error: any) {
        console.error(`Échec de synchro pour l'acte ${event.id}:`, error);
        
        // Échec : on marque l'acte en erreur dans Redux avec la raison du rejet
        dispatch(syncEventFailure({ 
          id: event.id, 
          error: error.message || "Erreur serveur lors de la synchronisation." 
        }));
        errorCount++;
      }
    }

    // 4. Fin du processus : on déverrouille l'état et on notifie l'agent
    dispatch(stopSyncing());

    if (errorCount === 0 && successCount > 0) {
      notify.success(`${successCount} acte(s) synchronisé(s) avec succès !`, toastId);
    } else if (errorCount > 0) {
      notify.error(`${errorCount} acte(s) rejeté(s). Veuillez vérifier le tableau de bord.`, toastId);
    } else {
      // Cas où tout était déjà en statut "ERROR" et a été ignoré
      notify.dismiss(toastId); 
    }

  }, [offlineQueue, isSyncing, dispatch]);

  useEffect(() => {
    // Écouteur de retour réseau (quand la tablette capte à nouveau la 4G/Wifi)
    const handleOnline = () => {
      console.info("🌐 Connexion rétablie. Lancement du moteur de synchronisation...");
      synchronize();
    };

    window.addEventListener("online", handleOnline);

    // 🔥 DÉTAIL CRITIQUE : Lancement au démarrage
    // Si l'agent ouvre l'application avec du réseau, mais qu'il y a des actes 
    // bloqués dans IndexedDB depuis la veille, on lance la synchro immédiatement.
    if (navigator.onLine && offlineQueue.length > 0 && !isSyncing) {
      synchronize();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [synchronize, navigator.onLine, offlineQueue.length, isSyncing]);

  // On retourne la fonction au cas où on voudrait forcer la synchro manuellement via un bouton
  return { forceSync: synchronize };
};