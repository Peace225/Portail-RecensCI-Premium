import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Crosshair, MapPin, Radio, ShieldCheck } from 'lucide-react';

const POLICE_AGENTS = [
  { id: "MAT-771-A", name: "BOKA Arthur", rank: "COMMISSAIRE", unit: "Anti-Criminalité", status: "online", zone: "Zone Sud" },
  { id: "MAT-882-B", name: "KONE Seydou", rank: "OFFICIER", unit: "Immigration", status: "online", zone: "Aéroport FHB" },
  { id: "MAT-904-C", name: "DIABY Awa", rank: "PATROUILLE", unit: "Voie Publique", status: "offline", zone: "Zone Nord" },
];

export default function PoliceAgents() {
  const [searchTerm, setSearchTerm] = useState("");

  const getRankBadge = (rank: string) => {
    switch(rank) {
      case 'COMMISSAIRE': return <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={10}/> {rank}</span>;
      case 'OFFICIER': return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">{rank}</span>;
      default: return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">{rank}</span>;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end border-b border-blue-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Unités & <span className="text-cyan-400">Effectifs</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
            Déploiement et Statut Radio des Opérateurs
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
            <input 
              type="text" placeholder="MATRICULE OU NOM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#050914] border border-blue-500/20 rounded-2xl pl-12 pr-6 py-3 text-xs w-80 focus:outline-none focus:border-cyan-400/50 transition-all uppercase text-white shadow-inner"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 bg-[#050914]/80 backdrop-blur-xl border border-blue-500/10 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-blue-500/20 bg-blue-900/10 text-[9px] font-black text-blue-400 uppercase tracking-widest">
          <div className="col-span-3">Identité & Matricule</div>
          <div className="col-span-2 text-center">Grade</div>
          <div className="col-span-3">Unité d'Affectation</div>
          <div className="col-span-2 text-center">Liaison Radio</div>
          <div className="col-span-2 text-center">Action Tactique</div>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
          <AnimatePresence>
            {POLICE_AGENTS.map((agent, index) => (
              <motion.div 
                key={agent.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 p-4 items-center bg-black/40 mb-2 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-xs font-black text-cyan-400">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{agent.name}</p>
                    <p className="text-[10px] font-mono text-blue-400 tracking-widest mt-0.5">{agent.id}</p>
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-center">{getRankBadge(agent.rank)}</div>

                <div className="col-span-3 flex items-center gap-2 text-slate-300">
                  <Crosshair size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold uppercase truncate">{agent.unit}</span>
                  <span className="text-slate-600 mx-2">|</span>
                  <MapPin size={12} className="text-cyan-500" />
                  <span className="text-[10px] font-bold uppercase text-cyan-400 truncate">{agent.zone}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  {agent.status === 'online' ? (
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest"><Radio size={12}/> Actif</span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Silence Radio</span>
                  )}
                </div>

                <div className="col-span-2 flex justify-center">
                  <button className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white text-[9px] font-black uppercase tracking-widest border border-blue-500/20 transition-colors">
                    Contacter
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}