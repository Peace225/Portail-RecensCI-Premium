import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, AlertOctagon, CheckCircle, XCircle, 
  Fingerprint, FileText, Search, UserMinus, ScanFace
} from 'lucide-react';

const FLAGGED_DOSSIERS = [
  { id: "TMP-9912", name: "KONE Oumar", issue: "DOUBLON BIOMÉTRIQUE", severity: "high", reason: "L'empreinte digitale correspond déjà au dossier CI-102-4456 (DIALLO Seydou)." },
  { id: "TMP-9905", name: "SYLLA Aminata", issue: "ÂGE INCOHÉRENT", severity: "medium", reason: "L'année de naissance déclarée (2005) ne correspond pas à l'acte de naissance fourni (1995)." },
  { id: "TMP-9884", name: "N'DRI Kouassi", issue: "PHOTO SUSPECTE", severity: "high", reason: "L'analyse IA détecte une potentielle photo falsifiée ou usurpée (Deepfake)." },
];

export default function CitizenValidation() {
  const [activeDossier, setActiveDossier] = useState(FLAGGED_DOSSIERS[0]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
          <ShieldAlert className="text-rose-500" size={32} />
          Centre de <span className="text-amber-400">Validation & Audit</span>
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Traitement des anomalies et prévention des fraudes</p>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
        
        {/* COLONNE GAUCHE (File des dossiers suspects) */}
        <div className="col-span-12 lg:col-span-4 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-5 border-b border-white/5 bg-black/40 flex items-center gap-2">
            <AlertOctagon size={16} className="text-rose-400" />
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Dossiers Suspects ({FLAGGED_DOSSIERS.length})</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {FLAGGED_DOSSIERS.map(dossier => (
              <div 
                key={dossier.id} onClick={() => setActiveDossier(dossier)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${activeDossier.id === dossier.id ? 'bg-rose-500/10 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-mono font-black ${activeDossier.id === dossier.id ? 'text-rose-400' : 'text-slate-400'}`}>{dossier.id}</span>
                  <span className={`w-2 h-2 rounded-full ${dossier.severity === 'high' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
                <h4 className="text-xs font-black text-white uppercase truncate mb-2">{dossier.name}</h4>
                <div className={`px-2 py-1 rounded inline-block text-[8px] font-black uppercase tracking-widest ${dossier.severity === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {dossier.issue}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE DROITE (Outil d'Investigation IA) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
            {/* Background Alerte */}
            <div className={`absolute top-0 left-0 w-full h-1 ${activeDossier.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`} />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-white uppercase mb-2">Dossier : {activeDossier.name}</h2>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">ID Temporaire: {activeDossier.id}</p>
              </div>
              <div className="text-right max-w-sm">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">Rapport de l'IA (Scan de sécurité)</span>
                <p className="text-xs text-slate-300 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg leading-relaxed">
                  {activeDossier.reason}
                </p>
              </div>
            </div>

            {/* Split Screen Comparaison */}
            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Ce qui a été déclaré */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative">
                <div className="absolute top-0 right-0 bg-white/10 px-3 py-1 rounded-bl-xl rounded-tr-2xl text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Données Soumises
                </div>
                <div className="space-y-6 mt-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <ScanFace size={24} className="text-cyan-400" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500">Reconnaissance Faciale</p>
                      <p className="text-xs font-black uppercase">Photo soumise le 19/03</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <FileText size={24} className="text-cyan-400" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500">Document d'identité</p>
                      <p className="text-xs font-black uppercase">Extrait de Naissance N°445</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ce que la base a trouvé */}
              <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 relative">
                <div className="absolute top-0 right-0 bg-rose-500/20 px-3 py-1 rounded-bl-xl rounded-tr-2xl text-[9px] font-black uppercase text-rose-400 tracking-widest">
                  Conflit Système
                </div>
                <div className="space-y-6 mt-4">
                  <div className="flex items-center gap-4 text-slate-300">
                    <Fingerprint size={24} className="text-rose-400" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-rose-400/70">Alerte Empreinte (AFIS)</p>
                      <p className="text-xs font-black uppercase text-white">Correspondance 99.8% avec CI-102-4456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <UserMinus size={24} className="text-rose-400" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-rose-400/70">Alerte Filiation</p>
                      <p className="text-xs font-black uppercase text-white">Parent déclaré décédé en 1990</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Critiques */}
            <div className="mt-8 flex gap-4 pt-6 border-t border-white/5">
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors">
                <Search size={14} /> Lancer Investigation Manuelle
              </button>
              <button className="flex-1 bg-rose-500 hover:bg-rose-400 text-black font-black text-[11px] uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <XCircle size={16} /> Rejeter pour Fraude
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}