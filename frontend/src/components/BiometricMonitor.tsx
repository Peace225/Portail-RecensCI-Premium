// src/backoffice/components/BiometricMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, UserCheck, ShieldCheck, Zap, Scan, Activity } from 'lucide-react';

const BiometricMonitor = () => {
  const [scanState, setScanState] = useState('SCANNING');
  const [activeID, setActiveID] = useState({
    name: "K. G. KOUHAME",
    id: "CI-882-990-X",
    location: "ABIDJAN / PLATEAU",
    match: 99.8,
    status: "VERIFIED"
  });

  // Simulation de cycle de scan
  useEffect(() => {
    const interval = setInterval(() => {
      setScanState('SCANNING');
      setTimeout(() => setScanState('MATCHED'), 1500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* SCANNER VISUEL (L'élément central) */}
      <div className="relative h-48 flex items-center justify-center bg-slate-950/50 rounded-3xl border border-white/5 overflow-hidden group">
        
        {/* Cercles concentriques animés */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-40 h-40 border-2 border-dashed border-purple-500 rounded-full" 
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute w-32 h-32 border border-cyan-500/50 rounded-full" 
          />
        </div>

        {/* L'icône de scan centrale */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {scanState === 'SCANNING' ? (
              <motion.div
                key="scanning"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                className="text-cyan-400 relative"
              >
                <Scan size={64} strokeWidth={1} className="animate-pulse" />
                <motion.div 
                  animate={{ y: [-20, 20, -20] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="matched"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400 flex flex-col items-center"
              >
                <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                  <ShieldCheck size={48} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] mt-3">Identity Locked</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD de coin */}
        <div className="absolute top-4 left-4 flex gap-1 items-center">
            <Activity size={12} className="text-purple-500 animate-pulse" />
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic">Live_Bio_Feed</span>
        </div>
      </div>

      {/* RÉSULTATS DU SCAN (Données Textuelles) */}
      <div className="bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 space-y-4">
        <div className="flex justify-between items-start border-b border-white/5 pb-3">
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase">Citoyen Identifié</p>
            <h4 className="text-lg font-black text-white italic tracking-tighter">{activeID.name}</h4>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-slate-500 uppercase">Match Score</p>
             <p className="text-emerald-500 font-black italic">{activeID.match}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BioDataItem label="National_ID" val={activeID.id} />
          <BioDataItem label="Location" val={activeID.location} />
        </div>

        <div className="pt-2">
           <div className="flex justify-between items-center bg-purple-500/5 p-3 rounded-xl border border-purple-500/20">
              <div className="flex items-center gap-2">
                 <UserCheck size={14} className="text-purple-400" />
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">Statut Civil: VALIDE</span>
              </div>
              <Zap size={10} className="text-purple-400 animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
};

const BioDataItem = ({ label, val }: any) => (
  <div>
    <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-[10px] font-bold text-slate-300 font-mono italic">{val}</p>
  </div>
);

export default BiometricMonitor;