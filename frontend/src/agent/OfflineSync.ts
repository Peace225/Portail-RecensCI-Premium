import { useEffect, useState } from "react";

/**
 * Hook de synchronisation offline pour les agents
 * @param key clé pour stocker les données dans localStorage
 * @param fetchData fonction asynchrone qui récupère les données de l'agent
 */
const useOfflineSync = <T>(key: string, fetchData: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncData = async () => {
      setLoading(true);

      try {
        // Charge les données depuis localStorage si elles existent
        const cached = localStorage.getItem(key);
        if (cached) {
          setData(JSON.parse(cached));
        }

        // Récupère les nouvelles données depuis l'API
        const result = await fetchData();
        setData(result);

        // Sauvegarde dans localStorage pour utilisation offline
        localStorage.setItem(key, JSON.stringify(result));

        setLoading(false);
      } catch (err: any) {
        console.error("Erreur de synchronisation agent:", err);
        setError(err.message || "Erreur inconnue");
        setLoading(false);
      }
    };

    syncData();

    // Optionnel : synchronisation périodique toutes les 5 minutes
    const interval = setInterval(syncData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [key, fetchData]);

  return { data, loading, error };
};

export default useOfflineSync;