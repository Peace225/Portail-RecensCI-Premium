import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, CheckCircle, XCircle, Clock, FileText, 
  User, MapPin, Fingerprint, ShieldAlert, AlertTriangle, 
  Database, Eye
} from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function CitizenFlux() {
  const [incomingQueue, setIncomingQueue] = useState<any[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPending = () => {
    apiService.get<any>('/citizens/pending?limit=15')
      .then(res => {
        const data = res.data || [];
        setIncomingQueue(data);
        if (data.length > 0 && !selectedDossier) setSelectedDossier(data[0]);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleProcess = (action: 'approve' | 'reject') => {
    if (!selectedDossier) return;
    setIsProcessing(true);
    const endpoint = action === 'approve' ? `/citizens/${selectedDossier.id}/approve` : `/citizens/${selectedDossier.id}/investigate`;
    apiService.patch(endpoint, {})
      .then(() => {
        setIncomingQueue(prev => prev.filter(c => c.id !== selectedDossier.id));
        setSelectedDossier(null);
      })
      .catch(() => {
        setIncomingQueue(prev => prev.filter(c => c.id !== selectedDossier.id));
        setSelectedDossier(null);
      })
      .finally(() => setIsProcessing(false));
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      
      {/* HEADER */}
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Activity className="text-emerald-400" size={32} />
            Flux d'Enregistrement <span className="text-cyan-400">Direct</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
            Sas de réception et d'analyse des formulaires citoyens
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-6 py-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Serveur RNPP à l'écoute</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* ==========================================
            COLONNE GAUCHE : FILE D'ATTENTE (LIVE)
        ========================================== */}
        <div className="col-span-12 lg:col-span-5 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" /> File d'attente ({incomingQueue.length})
            </h3>
            <span className="text-[9px] font-black uppercase text-slate-500 bg-white/5 px-2 py-1 rounded">Mise à jour Auto</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            <AnimatePresence>
              {incomingQueue.map((citoyen) => (
                <motion.div 
                  key={citoyen.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedDossier(citoyen)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    selectedDossier?.id === citoyen.id 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-black/40 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${citoyen.risk === 'high' ? 'bg-rose-500 animate-pulse' : citoyen.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <p className={`text-[10px] font-mono font-black tracking-widest ${selectedDossier?.id === citoyen.id ? 'text-cyan-400' : 'text-slate-400'}`}>
                        {citoyen.nni || citoyen.id}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{citoyen.time}</span>
                  </div>
                  
                  <h4 className="text-sm font-black text-white uppercase truncate">{citoyen.fullName || citoyen.name}</h4>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} /> {citoyen.city || citoyen.pob || '—'}
                    </span>
                    {citoyen.bio ? (
                      <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1"><Fingerprint size={10}/> Bio OK</span>
                    ) : (
                      <span className="text-[9px] text-amber-400 font-bold uppercase flex items-center gap-1"><AlertTriangle size={10}/> Sans Bio</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {incomingQueue.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                <Database size={48} className="mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Aucun dossier en attente</p>
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
            COLONNE DROITE : ANALYSE DU DOSSIER
        ========================================== */}
        <div className="col-span-12 lg:col-span-7 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
          
          {selectedDossier ? (
            <>
              {/* Overlay de chargement (quand on valide) */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <div className="p-6 border-b border-white/5 bg-black/40 flex justify-between items-center">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <FileText size={18} className="text-cyan-400" /> Analyse du Dossier {selectedDossier.nni || selectedDossier.id}
                </h3>
                {selectedDossier.risk === 'high' && (
                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert size={12} /> Risque Fraude Détecté
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                
                {/* IDENTITÉ */}
                <div className="flex gap-6 items-start">
                  <div className="w-24 h-32 bg-slate-900 border border-white/10 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                    <User size={32} className="text-slate-600 mb-2" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest absolute bottom-2">Photo Soumise</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Nom Complet déclaré</p>
                      <h2 className="text-2xl font-black text-white uppercase">{selectedDossier.fullName || selectedDossier.name}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ville / Lieu de Naissance</p>
                        <p className="text-xs font-black text-slate-300 uppercase">{selectedDossier.city || selectedDossier.pob || '—'}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-1">Téléphone / Email</p>
                        <p className="text-xs font-mono font-black text-cyan-400">{selectedDossier.phone || selectedDossier.email || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FILIATION */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">Données de Filiation</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Père déclaré</p>
                      <p className="text-sm font-black text-white uppercase">{selectedDossier.father}</p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mère déclarée</p>
                      <p className="text-sm font-black text-white uppercase">{selectedDossier.mother}</p>
                    </div>
                  </div>
                </div>

                {/* SÉCURITÉ & BIOMÉTRIE */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">Vérification Système</h4>
                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${
                    selectedDossier.bio ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${selectedDossier.bio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <Fingerprint size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase">Données Biométriques</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">
                          {selectedDossier.bio ? "Empreintes valides et hachées. Correspondance AFIS OK." : "Absence d'empreintes. Le citoyen devra se rendre en centre."}
                        </p>
                      </div>
                    </div>
                    {selectedDossier.bio && <CheckCircle className="text-emerald-500" size={20} />}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="p-6 border-t border-white/5 bg-black/40 flex gap-4">
                <button 
                  onClick={() => handleProcess('reject')}
                  className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle size={16} /> Suspendre / Rejeter
                </button>
                <button 
                  onClick={() => handleProcess('approve')}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle size={18} /> Valider & Générer NNI
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
              <Eye size={64} className="mb-4 text-cyan-500/50" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Sélectionnez un dossier dans la file</p>
              <p className="text-[10px] uppercase tracking-widest mt-2">Pour lancer la procédure d'analyse</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}