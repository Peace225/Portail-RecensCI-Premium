// src/backoffice/components/AlertCommandCenter.tsx
import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { ShieldAlert, Zap, X, Radio, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SOUND ASSETS (Utilisez des sons courts et "tech") ---
const ALARM_SOUND = 'https://codesandbox.io/api/v1/sandboxes/8p2x9/assets/alarm.mp3'; 
const CLICK_SOUND = 'https://codesandbox.io/api/v1/sandboxes/8p2x9/assets/click.mp3';

const AlertCommandCenter = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [playAlarm] = useSound(ALARM_SOUND, { volume: 0.5 });
  const [playClick] = useSound(CLICK_SOUND, { volume: 0.2 });

  // Simulation d'une alerte entrante (Backend WebSocket simulé)
  const triggerAlert = (type: 'INFO' | 'WARN' | 'CRITICAL') => {
    playClick();
    if (type === 'CRITICAL') playAlarm();
    
    const newAlert = {
      id: Date.now(),
      type,
      msg: type === 'CRITICAL' ? "INTRUSION RÉSEAU DÉTECTÉE - ZONE SUD" : "FLUX DE DONNÉES INSTABLE",
      time: new Date().toLocaleTimeString(),
      code: `ERR_${Math.floor(Math.random() * 9000 + 1000)}`
    };
    setAlerts([newAlert, ...alerts].slice(0, 5));
  };

  return (
    <div className="space-y-4">
      {/* BOUTONS DE TEST (Interface Opérateur) */}
      <div className="flex gap-2 border-b border-white/5 pb-4">
        <button 
          onClick={() => triggerAlert('CRITICAL')}
          className="flex-1 bg-rose-600/20 border border-rose-500/50 text-rose-500 text-[9px] font-black p-2 rounded-lg hover:bg-rose-500 hover:text-white transition-all uppercase italic"
        >
          Simuler Code Red
        </button>
        <button 
          onClick={() => triggerAlert('WARN')}
          className="flex-1 bg-amber-600/10 border border-amber-500/30 text-amber-500 text-[9px] font-black p-2 rounded-lg hover:bg-amber-500 hover:text-white transition-all uppercase italic"
        >
          Warning Test
        </button>
      </div>

      {/* LISTE DES ALERTES ANIMÉES */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`relative overflow-hidden p-4 rounded-2xl border ${
                alert.type === 'CRITICAL' 
                ? 'bg-rose-500/10 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.2)]' 
                : 'bg-slate-900/60 border-white/10'
              }`}
            >
              {/* Scanline Effect pour le mode critique */}
              {alert.type === 'CRITICAL' && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse" />
              )}

              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`${alert.type === 'CRITICAL' ? 'animate-bounce text-rose-500' : 'text-slate-500'}`}>
                    {alert.type === 'CRITICAL' ? <ShieldAlert size={20} /> : <Radio size={18} />}
                  </div>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${alert.type === 'CRITICAL' ? 'text-rose-400' : 'text-slate-300'}`}>
                      {alert.msg}
                    </p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[8px] font-mono opacity-50 italic">{alert.time}</span>
                      <span className="text-[8px] font-mono text-purple-400">ID: {alert.code}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {alert.type === 'CRITICAL' && (
                <div className="mt-3 flex gap-2 relative z-10">
                  <div className="h-1 flex-1 bg-rose-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5 }}
                      className="h-full bg-rose-500" 
                    />
                  </div>
                  <span className="text-[7px] font-black text-rose-500 uppercase">Auto-Reset: 5s</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="py-10 text-center opacity-20 flex flex-col items-center">
            <Terminal size={32} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucun incident détecté</p>
          </div>
        )}
      </div>
      {/* Dans BackofficeDashboard.tsx (Colonne Droite) */}
<GlassCard title="Console d'Intervention" icon={<ShieldAlert size={16} />}>
   <AlertCommandCenter />
</GlassCard>
    </div>
  );
};

export default AlertCommandCenter;