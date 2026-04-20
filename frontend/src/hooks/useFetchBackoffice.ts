// src/hooks/useFetchBackoffice.ts
import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";

/**
 * Hook de récupération de données pour le Backoffice via NestJS REST API.
 * @param endpoint Endpoint API (ex: '/citizens', '/agents')
 * @param params Paramètres de query optionnels
 */
const useFetchBackoffice = <T>(endpoint: string, params?: Record<string, string>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = endpoint;
      if (params && Object.keys(params).length > 0) {
        const qs = new URLSearchParams(params).toString();
        url = `${endpoint}?${qs}`;
      }
      const result = await apiService.get<T>(url);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchBackoffice;
