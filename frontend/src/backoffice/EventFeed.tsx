// src/backoffice/EventFeed.tsx
import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Baby, Skull, Users, 
  RefreshCw, AlertCircle, CheckCircle2, Timer 
} from "lucide-react";

const EventFeed: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [births, deaths]: [any[], any[]] = await Promise.all([
        apiService.get<any[]>('/events/birth?limit=10').catch(() => []),
        apiService.get<any[]>('/events/death?limit=5').catch(() => []),
      ]);

      const combined = [
        ...(Array.isArray(births) ? births.map((e: any) => ({ ...e, type: "NAISSANCE" })) : []),
        ...(Array.isArray(deaths) ? deaths.map((e: any) => ({ ...e, type: "DECES" })) : []),
      ].sort((a, b) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime())
       .slice(0, 10);

      setEvents(combined);
    } catch (err: any) {
      setError("Échec de synchronisation du flux d'activité.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) return (
    <div className="p-12 flex flex-col items-center justify-center bg-slate-900/40 border border-white/5 rounded-[2.5rem] animate-pulse">
      <Timer className="text-purple-500 animate-spin mb-3" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scan des flux entrants...</p>
    </div>
  );

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* HEADER DU FLUX */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500">
            <Clock size={18} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-widest italic">
            Flux d'Activité <span className="text-blue-500">Live</span>
          </h2>
        </div>
        <button 
          onClick={fetchEvents}
          className="p-2 text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* LISTE DES ÉVÉNEMENTS */}
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
            Aucun signal détecté sur le réseau.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {events.map((event, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={event.id}
                  className="p-6 hover:bg-white/[0.03] transition-colors group relative"
                >
                  <div className="flex items-start gap-5">
                    {/* Icône de type d'acte */}
                    <div className={`mt-1 p-3 rounded-2xl border transition-all group-hover:scale-110 ${
                      event.type === "NAISSANCE" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                      event.type === "DECES" ? "bg-slate-800 border-white/10 text-slate-400" :
                      "bg-purple-500/10 border-purple-500/20 text-purple-500"
                    }`}>
                      {event.type === "NAISSANCE" ? <Baby size={20} /> : 
                       event.type === "DECES" ? <Skull size={20} /> : <Users size={20} />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-white uppercase tracking-wider">
                          {event.type} ENREGISTRÉ
                        </p>
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Intl.DateTimeFormat('fr-CI', { hour: '2-digit', minute: '2-digit' }).format(new Date(event.created_at))}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        ID Agent: <span className="text-slate-200">{event.agent_id?.slice(0,8)}...</span> 
                        <span className="mx-2 opacity-20">|</span> 
                        Zone: <span className="text-slate-200">{event.zone_id || "NON SPÉCIFIÉ"}</span>
                      </p>

                      {/* Status Badge */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                          event.status === "VALIDÉ" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                        }`}>
                          {event.status === "VALIDÉ" ? <CheckCircle2 size={10} /> : <Timer size={10} />}
                          {event.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* FOOTER - Stats rapides */}
      <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">
          Flux chiffré de bout en bout — Protocole RECENSCI v2.0
        </p>
      </div>
    </div>
  );
};

export default EventFeed;