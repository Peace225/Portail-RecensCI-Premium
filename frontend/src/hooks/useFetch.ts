// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";
import { apiService, ApiError } from "../services/apiService";

export const useFetch = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback évite de recréer la fonction à chaque rendu du composant
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. On utilise NOTRE service API (qui injecte automatiquement le token Firebase)
      // On passe l'endpoint (ex: "/naissances/recentes") au lieu d'une URL complète
      const result = await apiService.get<T>(endpoint);
      setData(result);
    } catch (err: any) {
      // 2. On exploite notre classe d'erreur personnalisée pour des messages clairs
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err.message || "Erreur de communication avec les serveurs de l'État.");
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 3. On expose une fonction "refetch" très pratique pour les tableaux de bord
  return { data, loading, error, refetch: fetchData };
};