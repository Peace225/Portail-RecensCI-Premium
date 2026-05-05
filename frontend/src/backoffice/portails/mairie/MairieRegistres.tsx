import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, BookOpen, Clock, Search, Filter, 
  CheckCircle2, AlertTriangle, FileText, Database, ShieldAlert
} from 'lucide-react';

// --- Données Simulées ---
const LOGS = [
  { id: "LOG-091", time: "10:42:05", agent: "KOUASSI Jean", role: "DEPT_HEAD", action: "Validation Permis Construire #PC-2026-89", type: "VALIDATION", status: "success" },
  { id: "LOG-090", time: "10:38:12", agent: "TRAORE Seydou", role: "SERVICE_HEAD", action: "Enregistrement Naissance (KOUHAME K. G.)", type: "CREATION", status: "success" },
  { id: "LOG-089", time: "10:15:00", agent: "SYSTEM", role: "AUTO", action: "Tentative d'accès non autorisée (IP: 192.168.1.45)", type: "SECURITY", status: "alert" },
  { id: "LOG-088", time: "09:55:30", agent: "BAMBA Aminata", role: "AGENT", action: "Modification Registre Mariage #MR-2026-12", type: "EDITION", status: "warning" },
  { id: "LOG-087", time: "09:30:00", agent: "KONE Yacouba", role: "AGENT", action: "Clôture de patrouille (Marché Siporex)", type: "RAPPORT", status: "success" },
];

const REGISTRES = [
  { nom: "État Civil - Naissances", count: "12,450", lastSync: "Il y a 2 min", color: "emerald" },
  { nom: "État Civil - Mariages", count: "3,890", lastSync: "Il y a 5 min", color: "blue" },
  { nom: "État Civil - Décès", count: "1,204", lastSync: "Il y a 12 min", color: "slate" },
  { nom: "Main Courante (Police)", count: "845", lastSync: "Temps Réel", color: "rose" },
];

export default function MairieRegistres() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'alert': return <ShieldAlert size={16} className="text-rose-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      default: return <FileText size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto h-full flex flex-col min-h-screen">
      
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Activity className="text-amber-500" size={32} />
            Activité <span className="text-amber-400">& Registres</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            Journaux d'audit et bases de données locales
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
            <input 
              type="text" placeholder="RECHERCHER UN LOG..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#050914] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-full focus:outline-none focus:border-amber-500/50 transition-all uppercase text-white shadow-inner"
            />
          </div>
          <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-2 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* COLONNE GAUCHE : FLUX D'ACTIVITÉ (LOGS) */}
        <div className="col-span-12 lg:col-span-8 bg-[#050914] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-amber-500"/> Flux d'opérations (Aujourd'hui)
            </h3>
            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Enregistrement Actif
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="relative border-l border-white/10 ml-4 space-y-8 pb-4">
              <AnimatePresence>
                {LOGS.map((log, index) => (
                  <motion.div 
                    key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                    className="relative pl-8 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-[#050914] border border-white/10 flex items-center justify-center">
                      {getStatusIcon(log.status)}
                    </div>

                    <div className="bg-[#020617] border border-white/5 p-5 rounded-2xl group-hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-amber-500">{log.time}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded">{log.type}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">{log.id}</span>
                      </div>
                      
                      <p className="text-sm font-bold text-white mb-2 leading-snug">{log.action}</p>
                      
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        <span className="text-slate-300">{log.agent}</span> • <span>{log.role}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : REGISTRES OFFICIELS */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#050914] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2 mb-6">
              <Database size={14} className="text-amber-500"/> Bases de Données Locales
            </h3>

            <div className="space-y-4">
              {REGISTRES.map((reg, i) => (
                <div key={i} className="p-4 bg-[#020617] border border-white/5 rounded-2xl hover:border-amber-500/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 bg-${reg.color}-500/10 text-${reg.color}-500 rounded-xl group-hover:scale-110 transition-transform`}>
                      <BookOpen size={18} />
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-white">{reg.count}</span>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Entrées</p>
                    </div>
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{reg.nom}</h4>
                  <p className="text-[9px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-widest">
                    <Activity size={10} className="text-emerald-500"/> Sync: {reg.lastSync}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 text-slate-300 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Générer un rapport global
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}