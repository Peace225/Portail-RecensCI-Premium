import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, ShieldCheck, UserPlus, 
  MapPin, Activity, Filter, CheckCircle, Crosshair
} from 'lucide-react';
import { apiService } from '../../../services/apiService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

export default function MairieAgents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const institutionId = useSelector((state: RootState) => state.user.structureId);

  useEffect(() => {
    const url = institutionId ? `/agents?institutionId=${institutionId}` : '/agents';
    apiService.get<any[]>(url).then(setAgents).catch(() => {});
  }, [institutionId]);

  const filteredAgents = agents.filter(a =>
    (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ENTITY_ADMIN': return <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Admin</span>;
      case 'AGENT': return <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">Agent</span>;
      default: return <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest">{role}</span>;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end border-b border-amber-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Users className="text-amber-500" size={32} />
            Gestion des <span className="text-amber-400">Effectifs</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
            Ressources Humaines & Habilitations Locales
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
            <input 
              type="text" placeholder="MATRICULE OU NOM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#050914] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-80 focus:outline-none focus:border-amber-500/50 transition-all uppercase text-white shadow-inner"
            />
          </div>
          <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-2 transition-colors">
            <Filter size={16} />
          </button>
          <button className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <UserPlus size={18} /> Enrôler Agent
          </button>
        </div>
      </header>

      {/* KPI Rapides */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Users size={18}/></div>
          <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Effectif</p><p className="text-xl font-black text-white">{agents.length}</p></div>
        </div>
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Activity size={18}/></div>
          <div><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Agents de terrain</p><p className="text-xl font-black text-white">{agents.filter(a => a.role === 'AGENT').length}</p></div>
        </div>
      </div>

      {/* La Liste des Agents */}
      <div className="flex-1 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/60 text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-3">Identité & Matricule</div>
          <div className="col-span-2 text-center">Rôle</div>
          <div className="col-span-2">Direction</div>
          <div className="col-span-2">Service d'Affectation</div>
          <div className="col-span-2 text-center">Statut Connexion</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <AnimatePresence>
            {filteredAgents.map((agent, index) => (
              <motion.div 
                key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors group"
              >
                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center relative">
                    <span className="text-xs font-black text-white">{(agent.fullName || '?').charAt(0)}</span>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#050914] bg-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{agent.fullName}</p>
                    <p className="text-[10px] font-mono text-amber-500 tracking-widest mt-0.5">{agent.email}</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">{getRoleBadge(agent.role)}</div>
                <div className="col-span-2 text-xs font-bold text-slate-300 uppercase truncate">{agent.institution?.name || '—'}</div>
                <div className="col-span-2 flex items-center gap-2 text-slate-400">
                  <MapPin size={12} className="text-amber-500" />
                  <span className="text-[10px] font-bold uppercase truncate">{agent.institution?.type || '—'}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest"><CheckCircle size={12}/> Actif</span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-center">
                  <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-black transition-colors">
                    <Crosshair size={14} />
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