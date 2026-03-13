// src/components/Reports.tsx
import React from "react";
import { useFetch } from "../hooks/useFetch";
import { Card, CardContent } from "../components/Card";
import Button from "../components/Button";

// 1. Typage strict d'un rapport d'état civil
export interface Report {
  id: string;
  title: string;
  type: "MENSUEL" | "ANNUEL" | "AUDIT" | "STATISTIQUE";
  generatedAt: string; // Date ISO
  status: "READY" | "GENERATING" | "FAILED";
  downloadUrl?: string;
  size?: string; // Ex: "2.4 MB"
}

const Reports: React.FC = () => {
  // 2. Utilisation de notre hook sécurisé pour récupérer les rapports
  const { data: reports, loading, error, refetch } = useFetch<Report[]>("/backoffice/rapports");

  // Simulation d'une action de génération de rapport
  const handleGenerateReport = () => {
    alert("Demande de génération du rapport mensuel envoyée au serveur...");
    // Ici, on appellerait apiService.post("/backoffice/rapports/generer") puis refetch()
  };

  // 3. Gestion élégante du chargement
  if (loading) {
    return (
      <Card className="w-full h-64 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement des archives documentaires...</p>
      </Card>
    );
  }

  // 4. Gestion claire des erreurs
  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50 p-6 text-center">
        <DocumentTextIcon className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-800 font-bold mb-2">Impossible de charger les rapports</p>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          Réessayer
        </Button>
      </Card>
    );
  }

  const reportList = reports || [];

  return (
    <div className="space-y-6">
      {/* En-tête avec action principale */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderIcon className="w-6 h-6 text-orange-600" />
            Rapports & Exports
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Consultez et téléchargez les synthèses statistiques de l'état civil.
          </p>
        </div>
        <Button 
          onClick={handleGenerateReport}
          leftIcon={<PlusIcon className="w-5 h-5" />}
        >
          Nouveau Rapport
        </Button>
      </div>

      {/* Liste des rapports stylisée */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-0">
          {reportList.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Aucun rapport n'a été généré pour le moment.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {reportList.map((report) => (
                <li key={report.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Informations du rapport */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      report.type === "AUDIT" ? "bg-purple-100 text-purple-600" :
                      report.type === "STATISTIQUE" ? "bg-blue-100 text-blue-600" :
                      "bg-orange-100 text-orange-600"
                    }`}>
                      <DocumentReportIcon className="w-6 h-6" />
                    </div>
                    
                    <div>
                      <h3 className="text-md font-bold text-gray-900">{report.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Intl.DateTimeFormat('fr-CI', { 
                            dateStyle: 'long', timeStyle: 'short' 
                          }).format(new Date(report.generatedAt))}
                        </span>
                        {report.size && (
                          <>
                            <span>•</span>
                            <span>{report.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Téléchargement ou Statut) */}
                  <div className="flex items-center sm:justify-end min-w-[140px]">
                    {report.status === "READY" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.open(report.downloadUrl, '_blank')}
                        leftIcon={<DownloadIcon className="w-4 h-4" />}
                        className="w-full sm:w-auto"
                      >
                        Télécharger
                      </Button>
                    ) : report.status === "GENERATING" ? (
                      <span className="inline-flex items-center text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600 mr-2"></div>
                        En cours...
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                        Échec
                      </span>
                    )}
                  </div>

                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;

/* --- Icônes (Heroicons) --- */
const DocumentTextIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const DocumentReportIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FolderIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const PlusIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const CalendarIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const DownloadIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;