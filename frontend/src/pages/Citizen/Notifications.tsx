// src/pages/Citizen/Notifications.tsx
import React, { useState } from "react";
import { 
  Bell, CheckCircle2, AlertCircle, Info, 
  Trash2, MailOpen, Clock, ChevronRight, Sparkles, Filter
} from "lucide-react";

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
    title: "Recensement Validé",
    message: "Les renseignements de votre ménage ont été certifiés par l'INS. Votre Identité Numérique est désormais complète.",
    time: "Il y a 2 heures",
    type: "success",
    isRead: false
  },
  {
    id: 2,
    title: "Alerte Sociale : Dossier Pension",
    message: "Le trigger intelligent a détecté une éligibilité. Veuillez valider votre RIB pour activer les versements.",
    time: "Hier",
    type: "alert",
    isRead: false
  },
  {
    id: 3,
    title: "Maintenance Gouvernementale",
    message: "Optimisation des serveurs RecensCI prévue ce dimanche. Aucun impact sur vos données biométriques.",
    time: "Il y a 2 jours",
    type: "info",
    isRead: true
  }
];

const Notifications: React.FC = () => {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotif = (id: number) => {
    setNotifs(notifs.filter(n => n.id !== id));
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20">
      
      {/* --- HEADER STYLE "COMMAND CENTER" --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-orange-500 rounded-full" />
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Flux d'Activité</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <p className="text-slate-400 font-black text-[10px] tracking-[0.3em] uppercase italic">
              {unreadCount} Message(s) non lu(s)
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
            <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all border border-transparent hover:border-slate-200">
                <Filter size={20} />
            </button>
            <button 
                onClick={markAllRead}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-orange-600 transition-all active:scale-95"
            >
                <MailOpen size={16} /> Tout marquer
            </button>
        </div>
      </div>

      {/* --- LISTE DES NOTIFICATIONS --- */}
      <div className="grid grid-cols-1 gap-6">
        {notifs.length > 0 ? (
          notifs.map((n) => (
            <div 
              key={n.id} 
              className={`group relative overflow-hidden p-8 md:p-10 rounded-[3.5rem] border transition-all duration-500 ${
                n.isRead 
                ? 'bg-white/40 border-slate-100 opacity-60 grayscale-[0.5]' 
                : 'bg-white border-transparent shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_70px_-15px_rgba(249,115,22,0.1)] hover:border-orange-100'
              }`}
            >
              {/* Overlay Gradient au survol */}
              {!n.isRead && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-orange-500/10 transition-all" />
              )}

              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* ICON TYPE AVEC EFFET SHADOW */}
                <div className={`w-20 h-20 shrink-0 rounded-[2rem] flex items-center justify-center shadow-inner ${
                  n.type === 'success' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' : 
                  n.type === 'alert' ? 'bg-orange-50 text-orange-600 shadow-orange-100' : 'bg-blue-50 text-blue-600 shadow-blue-100'
                }`}>
                  {n.type === 'success' && <CheckCircle2 size={32} strokeWidth={2.5} />}
                  {n.type === 'alert' && <AlertCircle size={32} strokeWidth={2.5} />}
                  {n.type === 'info' && <Info size={32} strokeWidth={2.5} />}
                </div>

                {/* CONTENT SECTION */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                        <h4 className={`text-xl font-black tracking-tight ${n.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                        {n.title}
                        </h4>
                        {!n.isRead && <Sparkles size={16} className="text-orange-400" />}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</span>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium max-w-3xl">
                    {n.message}
                  </p>
                  
                  {/* ACTIONS CACHÉES / HOVER */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex gap-6">
                        <button className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-orange-600">
                            Consulter le dossier <ChevronRight size={14} />
                        </button>
                        <button 
                            onClick={() => deleteNotif(n.id)}
                            className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-red-600"
                        >
                            <Trash2 size={14} /> Archiver
                        </button>
                    </div>
                    <div className="hidden md:block">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">System ID: #00{n.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="relative inline-block">
                <Bell size={80} className="mx-auto text-slate-200 mb-6" />
                <div className="absolute inset-0 bg-slate-50 blur-xl opacity-50" />
            </div>
            <p className="text-slate-400 font-black uppercase text-xs tracking-[0.4em]">Fréquence vide • Aucun signal</p>
          </div>
        )}
      </div>

      {/* --- FOOTER INFO --- */}
      <div className="bg-orange-500 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-orange-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 p-10 opacity-20"><Bell size={100} /></div>
        <div className="relative z-10">
            <h3 className="font-black text-xl italic tracking-tight">Besoin d'aide sur une notification ?</h3>
            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest mt-1">L'assistance RecensCI répond en moins de 10 minutes</p>
        </div>
        <button className="relative z-10 px-10 py-4 bg-white text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 hover:text-white transition-all">
            Contacter le support
        </button>
      </div>
    </div>
  );
};

export default Notifications;