import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  Landmark, Users, FolderTree, Settings, LogOut, 
  ChevronRight, Activity, MapPin, Database, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MairieLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Les menus spécifiques au Maire / Admin Mairie
  const menuItems = [
    { name: "Tableau de Bord", path: "/portail/mairie", icon: <Landmark size={18} />, exact: true },
    { name: "Directions & Services", path: "/portail/mairie/departements", icon: <FolderTree size={18} /> },
    { name: "Gestion des Agents", path: "/portail/mairie/agents", icon: <Users size={18} /> },
    { name: "Activité & Registres", path: "/portail/mairie/registres", icon: <Activity size={18} /> },
    { name: "Paramètres Locaux", path: "/portail/mairie/parametres", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
      
      {/* ==========================================
          SIDEBAR SPÉCIFIQUE MAIRIE (Thème AMBRE)
      ========================================== */}
      <aside className="w-[300px] bg-[#050914] border-r border-amber-500/10 flex flex-col p-6 relative z-20 shadow-2xl">
        {/* Glow effet latéral */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 via-amber-400 to-transparent opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />

        {/* En-tête Sidebar : Identité de la Mairie */}
        <div className="mb-10 mt-2 px-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Landmark className="text-amber-500" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">
              Portail <span className="text-amber-500">Mairie</span>
            </h2>
            <p className="text-[9px] font-black text-amber-500/70 uppercase tracking-[0.2em] mt-0.5">
              Entité Connectée
            </p>
          </div>
        </div>

        {/* Navigation du Maire */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            // Vérifie si on est sur la page exacte (pour le dashboard) ou un sous-menu
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                  isActive
                  ? "bg-amber-500/10 border border-amber-500/30 text-white shadow-lg" 
                  : "hover:bg-white/5 text-slate-400 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={isActive ? "text-amber-500" : "text-slate-600 group-hover:text-amber-400/70 transition-colors"}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="activeMairieIndicator">
                    <ChevronRight size={14} className="text-amber-500" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profil de l'Admin en bas de Sidebar */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-sm shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                KY
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase">Kone Yacouba</p>
                <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Admin Mairie</p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors justify-center group">
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================
          ZONE CONTENU (OUTLET)
      ========================================== */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-[#020617] to-[#020617]">
        
        {/* Top Header Mairie */}
        <header className="shrink-0 z-50 bg-[#050914]/60 backdrop-blur-xl border-b border-amber-500/10 h-20 flex justify-between items-center px-8 shadow-md">
           <div className="flex items-center gap-2">
             <MapPin size={16} className="text-amber-500" />
             <span className="text-xs font-black text-white uppercase tracking-widest">Mairie de Yopougon</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Database size={12} className="text-emerald-500" />
                <span>SYNC HYPERVISEUR : <span className="text-emerald-400">ACTIF</span></span>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-amber-500 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              </button>
           </div>
        </header>

        {/* C'est ici que MairieDashboard, MairieDepartments, etc. vont s'afficher */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
}