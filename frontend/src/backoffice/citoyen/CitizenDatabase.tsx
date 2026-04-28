import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, CheckCircle, Clock, AlertTriangle, 
  User, MapPin, Fingerprint, FileText, X, ChevronRight, Download, Database
} from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function CitizenDatabase() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.get<any>('/citizens?limit=50')
      .then(res => setCitizens(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchTerm) return;
    const timer = setTimeout(() => {
      apiService.get<any>(`/citizens?search=${encodeURIComponent(searchTerm)}&limit=50`)
        .then(res => setCitizens(res.data || []))
        .catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'VALIDE': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: <CheckCircle size={14}/>, label: 'VALIDÉ' };
      case 'EN_ATTENTE_VALIDATION': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <Clock size={14}/>, label: 'ATTENTE' };
      case 'SUSPECT': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: <AlertTriangle size={14}/>, label: 'ANOMALIE' };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', icon: <User size={14}/>, label: 'INCONNU' };
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto relative h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Database className="text-cyan-400" size={32} />
            Registre National <span className="text-purple-500">(RNPP)</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Base de données des citoyens vérifiés</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
          <input 
            type="text" placeholder="NNI OU NOM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#050914] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-96 focus:outline-none focus:border-cyan-500/50 transition-all uppercase text-white shadow-inner"
          />
        </div>
      </header>

      <div className="flex-1 bg-[#050914]/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/40 text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <div className="col-span-3">Identité & NNI</div>
          <div className="col-span-2">Localisation</div>
          <div className="col-span-2">Date Naiss.</div>
          <div className="col-span-2 text-center">Biométrie</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1 text-center">Action</div>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          {loading && <div className="flex justify-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" /></div>}
          <AnimatePresence>
            {citizens.map((citizen, index) => {
              const statusConf = getStatusConfig(citizen.status);
              return (
                <motion.div 
                  key={citizen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} onClick={() => setSelectedCitizen(citizen)}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                      <span className="text-sm font-black text-white">{citizen.fullName?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase">{citizen.fullName}</p>
                      <p className="text-[10px] font-mono text-cyan-400 mt-0.5 tracking-widest">{citizen.nni}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-400"><MapPin size={14} className="text-slate-500" /><span className="text-[10px] font-bold uppercase">{citizen.city || '—'}</span></div>
                  <div className="col-span-2 text-xs font-mono font-bold text-slate-300">{citizen.birthDate ? new Date(citizen.birthDate).toLocaleDateString('fr-FR') : '—'}</div>
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded border text-slate-400 bg-slate-500/10 border-slate-500/20">
                      <Fingerprint size={12} /><span className="text-[9px] font-black uppercase tracking-wider">—</span>
                    </div>
                  </div>
                  <div className="col-span-2"><div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConf.bg} ${statusConf.border} ${statusConf.color}`}>{statusConf.icon}<span className="text-[9px] font-black tracking-widest">{statusConf.label}</span></div></div>
                  <div className="col-span-1 flex justify-center"><button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors"><ChevronRight size={16} /></button></div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* PANNEAU LATÉRAL (Détails) */}
      <AnimatePresence>
        {selectedCitizen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[2000]" onClick={() => setSelectedCitizen(null)} />
            <motion.div initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[500px] bg-[#050914] border-l border-white/10 z-[2001] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40">
                <div className="flex items-center gap-3 text-cyan-400"><FileText size={20} /><h2 className="text-xs font-black uppercase tracking-widest">Dossier N° {selectedCitizen.id}</h2></div>
                <button onClick={() => setSelectedCitizen(null)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <div className="p-8 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="flex gap-6 items-center">
                  <div className="w-24 h-32 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center relative overflow-hidden">
                    <User size={40} className="text-slate-600" />
                    <div className="absolute bottom-0 w-full bg-cyan-500/20 text-center py-1 backdrop-blur-md"><span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Photo ID</span></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase leading-none mb-2">{selectedCitizen.fullName || selectedCitizen.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">NNI : {selectedCitizen.nni || selectedCitizen.id}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">Ville: {selectedCitizen.city || '—'}</span>
                      <span className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">Email: {selectedCitizen.email || '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Données de Filiation</h4>
                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 space-y-4">
                    <div><p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nom du Père</p><p className="text-xs font-black text-white uppercase">{selectedCitizen.father}</p></div>
                    <div><p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nom de la Mère</p><p className="text-xs font-black text-white uppercase">{selectedCitizen.mother}</p></div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-black/40 flex gap-4">
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors"><Download size={14} /> Imprimer Fiche</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}