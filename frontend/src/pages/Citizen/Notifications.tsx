// src/pages/citizen/Notifications.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, CheckCircle2, AlertCircle, Info, 
  Trash2, MailOpen, Clock, ChevronRight, Sparkles, Filter,
  Activity, ShieldCheck, Zap, Cpu, MessageSquare, Archive
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiService";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "success" | "alert" | "info";
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Séquençage Citoyen Terminé",
    message: "Les renseignements de votre ménage ont été certifiés par le Cloud Souverain. Votre Identité Numérique est désormais active sur le Node CI-01.",
    time: "T - 2 HEURES",
    type: "success",
    isRead: false
  },
  {
    id: 2,
    title: "Alerte Algorithmique : Éligibilité",
    message: "Le trigger intelligent a détecté une éligibilité aux bourses sociales. Veuillez synchroniser votre RIB pour activer les flux financiers.",
    time: "T - 24 HEURES",
    type: "alert",
    isRead: false
  },
  {
    id: 3,
    title: "Maintenance Infrastructure",
    message: "Optimisation des serveurs de la Blockchain d'État prévue ce dimanche. Intégrité des données biométriques garantie.",
    time: "T - 2 JOURS",
    type: "info",
    isRead: true
  }
];

const styles = `
  .glass-hud {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  @keyframes pulse-orange {
    0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
    100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
  }
  .unread-glow { animation: pulse-orange 2s infinite; }
`;

const Notifications: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);

  useEffect(() => {
    apiService.get<any[]>('/notifications').then((data) => {
      const mapped: Notification[] = data.map((n: any) => ({
        id: n.id,
        title: n.title || n.type || 'Notification',
        message: n.message || n.content || '',
        time: n.createdAt ? new Date(n.createdAt).toLocaleString() : '',
        type: n.type === 'ALERT' ? 'alert' : n.type === 'SUCCESS' ? 'success' : 'info',
        isRead: n.isRead ?? false,
      }));
      if (mapped.length > 0) setNotifs(mapped);
    }).catch(() => {
      // Fall back to mock data
    });
  }, []);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
    toast.success("Flux synchronisé : Tous les messages sont lus");
  };

  const deleteNotif = (id: number) => {
    apiService.patch(`/notifications/${id}/read`, {}).catch(() => {});
    setNotifs(notifs.filter(n => n.id !== id));
    toast.error("Entrée de log archivée");
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-10 pt-24 relative overflow-hidden font-sans selection:bg-orange-500/30">
      <style>{styles}</style>
      
      {/* --- BACKGROUND HUD --- */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,130,0,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* --- 1. HEADER : CONTROL CENTER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-orange-500">
               <Activity size={20} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Activity Feed</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic">
              Flux <span className="text-orange-500">Radar</span>
            </h2>
            <div className="flex items-center gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
               <span className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${unreadCount > 0 ? 'bg-orange-500 animate-ping' : 'bg-slate-700'}`} />
                 {unreadCount} Signaux entrants
               </span>
               <span>•</span>
               <span>Node: CI-REC-ALRT</span>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={markAllRead}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all active:scale-95 group"
            >
                <MailOpen size={16} className="group-hover:rotate-12 transition-transform" /> Synchroniser le flux
            </button>
          </div>
        </div>

        {/* --- 2. LISTE DES NOTIFICATIONS --- */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifs.length > 0 ? (
              notifs.map((n, idx) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative glass-hud p-6 md:p-8 rounded-[2.5rem] transition-all duration-500 overflow-hidden ${
                    !n.isRead ? 'border-orange-500/30 unread-glow bg-orange-500/[0.02]' : 'opacity-60 grayscale-[0.5]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    {/* ICON HEXAGONAL STYLE */}
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border-2 ${
                      n.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                      n.type === 'alert' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 
                      'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    }`}>
                      {n.type === 'success' && <ShieldCheck size={28} />}
                      {n.type === 'alert' && <Zap size={28} />}
                      {n.type === 'info' && <Cpu size={28} />}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{n.title}</h4>
                            {!n.isRead && <Sparkles size={16} className="text-orange-400 animate-pulse" />}
                          </div>
                          <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{n.time} • CID: #SEC-{n.id}992</p>
                        </div>
                        <button 
                          onClick={() => deleteNotif(n.id)}
                          className="p-3 bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white rounded-xl transition-all border border-white/5"
                        >
                          <Archive size={16} />
                        </button>
                      </div>

                      <p className="text-sm md:text-base text-slate-400 leading-relaxed font-medium">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white">
                          Ouvrir le terminal dédié <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              /* --- EMPTY STATE : SILENCE RADAR --- */
              <div className="text-center py-32 bg-white/[0.02] rounded-[4rem] border-2 border-dashed border-white/5">
                <Bell size={64} className="mx-auto text-slate-800 mb-6" />
                <p className="text-slate-600 font-mono uppercase text-xs tracking-[0.5em]">Silence Fréquence • Aucun Signal Détecté</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- FOOTER : SÉCURITÉ IA --- */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-10 rounded-[3.5rem] text-white shadow-[0_30px_60px_-15px_rgba(234,88,12,0.4)] relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <MessageSquare size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 text-center lg:text-left">
              <h3 className="font-black text-3xl italic tracking-tighter uppercase leading-none">Besoin d'un audit <br /> sur vos alertes ?</h3>
              <p className="text-orange-100/70 text-[10px] font-bold uppercase tracking-[0.2em] max-w-sm">L'Agent IA de RecensCI analyse vos messages 24/7 pour optimiser vos droits.</p>
            </div>
            <button className="px-12 py-5 bg-white text-orange-600 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#020617] hover:text-white transition-all active:scale-95">
              Ouvrir un canal sécurisé
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;