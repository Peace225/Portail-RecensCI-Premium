// src/components/AnalyticsPanel.tsx
import React from "react";
import { useFetch } from "../hooks/useFetch";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import Button from "./Button";

export interface AnalyticsData {
  metric: string;
  value: number;
  description?: string; // Optionnel : pour expliquer la métrique
  trend?: "up" | "down" | "stable"; // Optionnel : pour la visualisation
}

const AnalyticsPanel: React.FC = () => {
  // Utilisation de notre hook personnalisé qui gère l'injection du JWT et le cache
  const { data, loading, error, refetch } = useFetch<AnalyticsData[]>("/backoffice/analytics");

  // 1. État de chargement intégré au design
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Compilation des statistiques nationales...</p>
        </CardContent>
      </Card>
    );
  }

  // 2. État d'erreur avec possibilité de réessayer (très utile pour les agents en zone rurale)
  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center h-48 text-center p-6">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mb-3" />
          <p className="text-red-800 font-bold mb-1">Erreur de synchronisation</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button variant="outline" size="sm" onClick={refetch}>
            Actualiser les données
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Sécurité anti-crash au cas où data serait null
  const analyticsData = data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6 text-orange-600" />
          Tableau de bord analytique
        </h2>
        <button 
          onClick={refetch}
          className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-2"
        >
          <RefreshIcon className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Affichage sous forme de grille plutôt qu'une simple liste (<ul>) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsData.map((item) => (
          <Card key={item.metric} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{item.metric}</p>
                  <h3 className="text-3xl font-extrabold text-gray-900">{item.value.toLocaleString('fr-CI')}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-2">{item.description}</p>
                  )}
                </div>
                
                {/* Indicateur visuel de tendance si fourni par l'API */}
                {item.trend === "up" && (
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-green-600" />
                  </div>
                )}
                {item.trend === "down" && (
                  <div className="p-2 bg-red-50 rounded-lg">
                    <TrendingDownIcon className="w-5 h-5 text-red-600" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPanel;

/* --- Icônes (Heroicons) --- */
const ChartBarIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const RefreshIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const ExclamationTriangleIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const TrendingUpIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDownIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>;