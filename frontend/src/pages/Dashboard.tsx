// src/pages/Dashboard.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; 
import Header from "../components/Header";

/**
 * DASHBOARD LAYOUT - RecensCI
 * Structure de base pour toutes les pages authentifiées.
 * Gère la navigation latérale, la barre supérieure et le rendu dynamique.
 */
const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Navigation Latérale) 
          Reste fixe sur le côté gauche. 
      */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* CONTENEUR PRINCIPAL */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* 2. HEADER (Barre Supérieure) 
            Contient le profil, les notifications et la recherche.
        */}
        <header className="z-10 bg-white shadow-sm border-b border-slate-200">
          <Header />
        </header>

        {/* 3. ZONE DE CONTENU (Dynamique) 
            C'est ici que s'affichent tes formulaires (Naissances, Accidents, etc.)
        */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#F8FAFC]">
          <div className="py-8 px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
              
              {/* L'Outlet est le composant magique qui injecte 
                  la route enfant demandée (ex: /dashboard/naissances)
              */}
              <Outlet />

            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

// EXPORT PAR DÉFAUT : Indispensable pour l'import dans App.tsx
export default Dashboard;