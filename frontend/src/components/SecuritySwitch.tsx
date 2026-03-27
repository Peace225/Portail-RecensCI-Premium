// src/backoffice/components/SecuritySwitch.tsx
import { useSecurity } from '../context/SecurityContext';
import { ShieldAlert, ShieldCheck, Power } from 'lucide-react';
import { motion } from 'framer-motion';

const SecuritySwitch = () => {
  const { mode, toggleMode } = useSecurity();

  return (
    <button 
      onClick={toggleMode}
      className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all duration-700 font-black uppercase italic text-[10px] tracking-[0.2em] shadow-2xl ${
        mode === 'EMERGENCY' 
        ? 'bg-rose-600/20 border-rose-500 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]' 
        : 'bg-emerald-600/10 border-emerald-500/50 text-emerald-500'
      }`}
    >
      <motion.div
        animate={{ rotate: mode === 'EMERGENCY' ? 180 : 0 }}
        className="relative z-10"
      >
        <Power size={18} />
      </motion.div>
      
      <div className="flex flex-col items-start leading-none">
        <span className="opacity-60 text-[7px] mb-1">Système Statut</span>
        <span>{mode === 'EMERGENCY' ? 'CODE ROUGE : ACTIF' : 'SÉCURITÉ : STANDBY'}</span>
      </div>

      {mode === 'EMERGENCY' && (
        <motion.div 
          layoutId="glow-bg"
          className="absolute inset-0 bg-rose-500/20 blur-md animate-pulse rounded-2xl" 
        />
      )}
    </button>
  );
};

export default SecuritySwitch;