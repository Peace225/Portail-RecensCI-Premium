// src/hooks/useFetchBackoffice.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

/**
 * Hook de récupération de données spécialisé Supabase pour le Backoffice.
 * @param tableName Nom de la table à interroger
 * @param queryOptions Options optionnelles (filtres, select, etc.)
 */
const useFetchBackoffice = <T>(tableName: string, selectQuery: string = "*") => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Utilisation du client Supabase au lieu de fetch()
      // Cela injecte automatiquement ton token d'admin/agent
      const { data: result, error: supabaseError } = await supabase
        .from(tableName)
        .select(selectQuery);

      if (supabaseError) throw supabaseError;

      setData(result as unknown as T);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  }, [tableName, selectQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // On retourne 'refetch' pour permettre de rafraîchir manuellement (ex: bouton actualiser)
  return { data, loading, error, refetch: fetchData };
};

export default useFetchBackoffice;