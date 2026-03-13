// src/components/EventFeed.tsx
import React from "react";
import { useFetch } from "../hooks/useFetch";
import { VitalEvent } from "../types"; // Notre type strict défini précédemment
import { Card, CardContent } from "../components/Card";
import Button from "../components/Button";

const EventFeed: React.FC = () => {
  // Utilisation de notre hook sécurisé (qui injecte le JWT automatiquement)
  const { data: events, loading, error, refetch } = useFetch<VitalEvent[]>("/backoffice/actes/recents");

  // 1. État de chargement harmonisé
  if (loading) {
    return (
      <Card className="w-full h-64 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement du journal d'activité...</p>
      </Card>
    );
  }

  // 2. Gestion des erreurs avec option de rafraîchissement
  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-800 font-bold mb-2">Impossible de charger le flux</p>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Réessayer
        </Button>
      </Card>
    );
  }

  const feedEvents = events || [];

  return (
    <Card className="shadow-sm border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-xl">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          Flux d'Activité Récent
        </h2>
        <button 
          onClick={refetch}
          className="text-sm text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-md transition-colors"
          title="Actualiser le flux"
        >
          Actualiser
        </button>
      </div>

      <CardContent className="p-0">
        {feedEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Aucun acte enregistré récemment sur le réseau.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {feedEvents.map((event) => (
              <li key={event.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex space-x-4">
                  
                  {/* Icône dynamique selon le type d'acte */}
                  <div className="flex-shrink-0 mt-1">
                    {event.type === "NAISSANCE" ? (
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <BabyIcon className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : event.type === "DECES" ? (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <DocumentMinusIcon className="w-5 h-5 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 text-purple-600" />
                      </div>
                    )}
                  </div>

                  {/* Contenu de l'événement */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Déclaration de {event.type.toLowerCase()}
                      {/* Badge de statut */}
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                        event.status === "SYNCED" ? "bg-green-50 text-green-700 border-green-200" :
                        event.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {event.status === "SYNCED" ? "Validé" : event.status === "PENDING" ? "En attente" : "Rejeté"}
                      </span>
                    </p>
                    
                    <p className="text-sm text-gray-500 mt-1">
                      Saisi par l'Agent <span className="font-medium text-gray-700">{event.agentId}</span>
                      {' '}au centre <span className="font-medium text-gray-700">{event.structureId}</span>
                    </p>
                    
                    {event.errorMessage && (
                      <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                        Motif du rejet : {event.errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Horodatage */}
                  <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.DateTimeFormat('fr-CI', { 
                      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' 
                    }).format(new Date(event.createdAt))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default EventFeed;

/* --- Icônes (Heroicons) --- */
const ClockIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BabyIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DocumentMinusIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const UsersIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;