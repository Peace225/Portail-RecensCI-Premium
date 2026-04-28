import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldCheck, ShieldAlert, 
  MapPin, Battery, Signal, UserMinus, Crosshair, 
  Send, Lock, Activity, UserCog, CheckCircle, X, Database, Users
} from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function AgentList() {
  const [agents, setAgents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  useEffect(() => {
    apiService.get<any[]>('/agents').then(setAgents).catch(() => {});
  }, []);

  const filteredAgents = agents.filter(a =>
    (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'online': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'EN MISSION', dot: 'bg-emerald-500' };
      case 'offline': return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'HORS LIGNE', dot: 'bg-slate-500' };
      case 'alert': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'ANOMALIE (BATTERIE/GPS)', dot: 'bg-rose-500' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', label: 'INCONNU', dot: 'bg-slate-500' };
    }
  };

  const getClearanceColor = (clearance: string) => {
    switch(clearance) {
      case 'ALPHA': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      case 'BETA': return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 'GAMMA': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto relative h-full flex flex-col">
      <header className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
              <ShieldCheck className="text-purple-500" size={32} />
              Contrôle des <span className="text-cyan-400">Effectifs</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Gestion des accréditations et télémétrie terrain</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
            <input 
              type="text" placeholder="MATRICULE OU NOM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#050914] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-96 focus:outline-none focus:border-cyan-500/50 transition-all uppercase text-white shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
           {[
             { label: "Effectif Total", val: agents.length.toString(), icon: <Users size={16}/>, color: "text-blue-400" },
             { label: "Agents Actifs", val: agents.filter(a => a.role === 'AGENT').length.toString(), icon: <Activity size={16}/>, color: "text-emerald-400" },
             { label: "Alertes Terminaux", val: "0", icon: <ShieldAlert size={16}/>, color: "text-rose-400" },
             { label: "Admins Entité", val: agents.filter(a => a.role === 'ENTITY_ADMIN').length.toString(), icon: <Database size={16}/>, color: "text-purple-400" },
           ].map((kpi, i) => (
             <div key={i} className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>{kpi.icon}</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{kpi.label}</p>
                  <p className="text-xl font-black text-white tracking-tighter">{kpi.val}</p>
                </div>
             </div>
           ))}
        </div>
      </header>

      <div className="flex-1 bg-[#050914]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/40 text-[9px] font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-3">Identité & Matricule</div>
          <div className="col-span-2">Secteur Affecté</div>
          <div className="col-span-2 text-center">Habilitation</div>
          <div className="col-span-2 text-center">Télémétrie</div>
          <div className="col-span-2 text-center">Statut Connexion</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <AnimatePresence>
            {filteredAgents.map((agent, index) => {
              return (
                <motion.div 
                  key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedAgent(agent)}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center relative">
                      <UserCog size={18} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase">{agent.fullName}</p>
                      <p className="text-[10px] font-mono text-cyan-400 mt-0.5 tracking-widest">{agent.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-400">
                    <MapPin size={14} className="text-purple-500" />
                    <span className="text-[10px] font-bold uppercase truncate">{agent.institution?.name || '—'}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest text-purple-400 border-purple-500/30 bg-purple-500/10">{agent.role}</span>
                  </div>
                  <div className="col-span-2 flex justify-center items-center gap-4">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{new Date(agent.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                      <span className="text-[8px] font-black tracking-widest">ACTIF</span>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors"><Crosshair size={14} /></button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAgent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[2000]" onClick={() => setSelectedAgent(null)} />
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[450px] bg-[#050914] border-l border-white/10 z-[2001] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-3 text-purple-400"><ShieldCheck size={20} /><h2 className="text-xs font-black uppercase tracking-widest">Dossier Agent</h2></div>
                <button onClick={() => setSelectedAgent(null)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div><p className="text-[10px] font-black text-cyan-400 tracking-widest font-mono mb-1">{selectedAgent.id}</p><h3 className="text-xl font-black text-white uppercase">{selectedAgent.name}</h3></div>
                    <div className={`px-3 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${getClearanceColor(selectedAgent.clearance)}`}>LVL {selectedAgent.clearance}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative z-10 border-t border-white/10 pt-4">
                    <div><p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Téléphone</p><p className="text-xs font-mono text-white">{selectedAgent.phone}</p></div>
                    <div><p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">IP Auth</p><p className="text-xs font-mono text-slate-300">{selectedAgent.ip}</p></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Rendement Journalier</h4>
                  <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                    <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400"><CheckCircle size={20}/></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-slate-400 uppercase">Citoyens Enrôlés</span><span className="text-xs font-black text-white">{selectedAgent.quota} / 250</span></div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(selectedAgent.quota/250)*100}%` }} /></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-black/40 space-y-3">
                <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"><Send size={14} className="text-cyan-400" /> Envoyer un ordre</button>
                <div className="flex gap-3">
                  <button className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-black text-[9px] uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"><Lock size={12} /> Geler Session</button>
                  <button className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-black text-[9px] uppercase tracking-widest py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"><UserMinus size={12} /> Révoquer</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}