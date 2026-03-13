// src/layouts/BackofficeLayout.tsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const BackofficeLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-sans text-slate-300">
      
      {/* Mini Sidebar Admin */}
      <aside className="w-20 flex flex-col items-center py-8 border-r border-slate-800 bg-[#030712]">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-10 shadow-lg shadow-indigo-500/20">
          <ShieldCheck size={24} />
        </div>
        <button 
          onClick={() => navigate("/dashboard")}
          className="p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-500 hover:text-white"
          title="Retour au Portail"
        >
          <ArrowLeft size={24} />
        </button>
      </aside>

      {/* Contenu Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8 md:p-12 bg-gradient-to-br from-[#020617] to-[#0f172a]">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BackofficeLayout;