// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { 
  User, ShieldCheck, Activity, BarChart3, 
  QrCode, Fingerprint, Globe, Bell, 
  Settings, Zap, Cpu, ArrowUpRight, Database
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <Cpu size={60} className="text-orange-500 animate-spin" />
          <p className="text-orange-500 font-mono text-xs tracking-[0.5em] animate-pulse">
            DÉCRYPTAGE DES DONNÉES SOUVERAINES...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-28 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(255,130,0,0.1)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* --- HEADER DASHBOARD (Status HUD) --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
              Citoyen : <span className="text-orange-500">Kouassi Amenan</span>
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              ID : CI-225-88392-04 ● SESSION SÉCURISÉE
            </div>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Bell size={18} className="text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Alertes</span>
            </button>
            <button className="flex-1 lg:flex-none px-6 py-3 bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-all flex items-center justify-center gap-2">
              <QrCode size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ma Carte ID</span>
            </button>
          </div>
        </div>

        {/* --- GRILLE PRINCIPALE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLONNE GAUCHE : STATS & DATA (7 COL) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Cartes de Stats Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                icon={<ShieldCheck className="text-emerald-500" />} 
                title="Statut Biométrique" 
                value="CERTIFIÉ" 
                desc="Validation AES-512 ok"
              />
              <StatCard 
                icon={<Activity className="text-blue-500" />} 
                title="Indice de Complétude" 
                value="92%" 
                desc="+2% depuis Janvier"
              />
            </div>

            {/* Graphique de Données (Placeholder Stylisé) */}
            <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Flux de Recensement National</h3>
                  <BarChart3 size={20} className="text-orange-500" />
               </div>
               <div className="h-48 flex items-end gap-2 md:gap-4">
                  {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar overflow-hidden">
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-1000 ease-out"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40 animate-pulse" />
                      </div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-[8px] font-mono text-slate-600 uppercase tracking-widest">
                  <span>Région Sud</span>
                  <span>Région Nord</span>
                  <span>Région Ouest</span>
               </div>
            </div>

            {/* Liste d'Activités Récentes */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Logs de Sécurité</h3>
               <div className="space-y-4">
                  <LogItem status="success" text="Authentification biométrique réussie" time="Il y a 2 min" />
                  <LogItem status="info" text="Mise à jour de l'adresse de résidence" time="Il y a 3h" />
                  <LogItem status="warning" text="Tentative de connexion (Abidjan, CI)" time="Hier" />
               </div>
            </div>
          </div>

          {/* COLONNE DROITE : CARTE HOLOGRAPHIQUE (5 COL) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* CARTE ID HOLOGRAPHIQUE */}
            <div className="group perspective-1000">
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-950 border border-white/20 rounded-[2rem] p-8 shadow-2xl transition-all duration-500 hover:rotate-y-12 overflow-hidden">
                {/* Effet Hologramme */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-500/10 opacity-50 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-scan-fast" />

                <div className="flex justify-between items-start mb-12">
                   <div className="p-2 bg-white rounded-lg">
                      <img src="/images/logo.png" alt="Logo" className="w-10 h-8 object-contain" />
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-mono text-orange-500">RÉPUBLIQUE DE CÔTE D'IVOIRE</p>
                      <p className="text-[6px] font-mono text-slate-500 uppercase">Ministère du Numérique</p>
                   </div>
                </div>

                <div className="flex gap-6 mb-8">
                   <div className="w-24 h-32 bg-slate-900 border border-white/10 rounded-xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-orange-500/10 animate-pulse" />
                      <User size={60} className="absolute bottom-0 left-1/2 -translate-x-1/2 text-slate-700" />
                   </div>
                   <div className="space-y-3">
                      <div>
                        <p className="text-[7px] uppercase text-slate-500">Nom Complet</p>
                        <p className="text-sm font-bold text-white uppercase italic">Kouassi Amenan</p>
                      </div>
                      <div>
                        <p className="text-[7px] uppercase text-slate-500">Date de Naissance</p>
                        <p className="text-xs font-bold text-white">12 / 05 / 1994</p>
                      </div>
                      <div>
                        <p className="text-[7px] uppercase text-slate-500">Lieu de Résidence</p>
                        <p className="text-xs font-bold text-white">Abidjan, Cocody</p>
                      </div>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                   <Fingerprint className="text-orange-500" size={32} />
                   <div className="bg-white p-2 rounded-lg">
                      <QrCode size={40} className="text-black" />
                   </div>
                </div>
              </div>
            </div>

            {/* Widget Global Sync */}
            <div className="bg-gradient-to-br from-blue-600/20 to-orange-600/20 border border-white/10 rounded-3xl p-8 text-center space-y-4">
                <Globe size={40} className="mx-auto text-blue-400 animate-spin-slow" />
                <h4 className="text-white font-black uppercase text-sm italic tracking-widest">Souveraineté Mondiale</h4>
                <p className="text-[10px] text-slate-400 uppercase leading-relaxed">
                  Vos données sont synchronisées avec le registre national sécurisé CI-RE-01.
                </p>
                <div className="flex justify-center gap-2">
                   {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />)}
                </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-fast { 0% { top: -10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 110%; opacity: 0; } }
        .animate-scan-fast { animation: scan-fast 2s linear infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .rotate-y-12 { transform: rotateY(12deg); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

// --- SOUS-COMPOSANTS DASHBOARD ---

const StatCard = ({ icon, title, value, desc }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-black/40 rounded-xl">{icon}</div>
      <ArrowUpRight size={16} className="text-slate-600 group-hover:text-white" />
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
    <p className="text-2xl font-black text-white italic mb-1">{value}</p>
    <p className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">{desc}</p>
  </div>
);

const LogItem = ({ status, text, time }: any) => {
  const dotColor = status === 'success' ? 'bg-emerald-500' : status === 'warning' ? 'bg-orange-500' : 'bg-blue-500';
  return (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`} />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide">{text}</span>
      </div>
      <span className="text-[8px] font-mono text-slate-600">{time}</span>
    </div>
  );
};

export default Dashboard;