import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Activity, Database, Server, Signal, 
  CheckCircle, Clock, AlertTriangle, BarChart3, 
  Wifi, Smartphone, ShieldCheck, DownloadCloud
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { apiService } from '../../services/apiService';

// --- DONNÉES SIMULÉES ---
const HOURLY_DATA = [
  { time: '08:00', volume: 120, offline: 10 },
  { time: '09:00', volume: 350, offline: 25 },
  { time: '10:00', volume: 680, offline: 15 },
  { time: '11:00', volume: 890, offline: 50 },
  { time: '12:00', volume: 740, offline: 80 }, // Pause déj / zones sans réseau
  { time: '13:00', volume: 420, offline: 30 },
  { time: '14:00', volume: 950, offline: 10 },
];

const DEVICE_STATUS = [
  { region: 'Abidjan (Cocody)', synced: 98, pending: 2, status: 'optimal' },
  { region: 'San-Pédro', synced: 85, pending: 15, status: 'warning' },
  { region: 'Korhogo (Poro)', synced: 60, pending: 40, status: 'alert' },
  { region: 'Bouaké (Gbêkê)', synced: 92, pending: 8, status: 'optimal' },
];

const INITIAL_FEED = [
  { id: "REQ-0992-A", agent: "AGN-882-A", zone: "Yopougon", type: "Enrôlement Biométrique", time: "À l'instant", status: "synced" },
  { id: "REQ-0991-C", agent: "AGN-442-C", zone: "San-Pédro", type: "Mise à jour Registre", time: "Il y a 12s", status: "pending" },
  { id: "REQ-0990-A", agent: "AGN-771-A", zone: "Cocody", type: "Enrôlement Biométrique", time: "Il y a 45s", status: "synced" },
  { id: "REQ-0989-B", agent: "AGN-105-B", zone: "Bouaké", type: "Requête Citoyenne", time: "Il y a 1m", status: "synced" },
  { id: "REQ-0988-A", agent: "AGN-934-A", zone: "Korhogo", type: "Scan Document", time: "Il y a 2m", status: "failed" },
];

export default function AgentData() {
  const [liveFeed, setLiveFeed] = useState(INITIAL_FEED);
  const [kpiData, setKpiData] = useState<{ totalAgents: number; syncedDevices: number } | null>(null);

  useEffect(() => {
    apiService.get<any>('/analytics/dashboard').then((data) => {
      setKpiData({
        totalAgents: data?.agents?.total ?? data?.totalAgents ?? null,
        syncedDevices: data?.devices?.synced ?? data?.syncedDevices ?? null,
      });
    }).catch(() => {});
  }, []);

  // Simulation d'arrivée de nouvelles données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const newEntry = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}-${['A','B','C'][Math.floor(Math.random()*3)]}`,
        agent: `AGN-${Math.floor(100 + Math.random() * 900)}-${['A','B','C'][Math.floor(Math.random()*3)]}`,
        zone: ['Abidjan', 'Bouaké', 'Korhogo', 'San-Pédro'][Math.floor(Math.random()*4)],
        type: "Enrôlement Biométrique",
        time: "À l'instant",
        status: Math.random() > 0.8 ? "pending" : "synced"
      };
      
      setLiveFeed(prev => {
        const newFeed = [newEntry, ...prev];
        if (newFeed.length > 8) newFeed.pop(); // Garder les 8 derniers
        return newFeed;
      });
    }, 4500); // Un nouveau flux toutes les 4.5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      
      {/* ==========================================
          HEADER & KPI'S
      ========================================== */}
      <header className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
              <Database className="text-cyan-400" size={32} />
              Flux de <span className="text-purple-500">Données Terrain</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
              Télémétrie des terminaux & Statistiques de collecte
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#050914] border border-white/10 rounded-2xl px-6 py-3 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Réception Active</span>
            <span className="text-slate-500 mx-2">|</span>
            <span className="text-[10px] font-mono text-slate-400"><DownloadCloud size={14} className="inline mr-2 text-purple-400"/>24.5 MB/s</span>
          </div>
        </div>

        {/* Mini KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
           {[
             { label: "Dossiers Enrôlés (Aujourd'hui)", val: kpiData?.totalAgents != null ? String(kpiData.totalAgents) : "4,150", icon: <CheckCircle size={16}/>, color: "text-emerald-400", border: "border-emerald-500/30" },
             { label: "Paquets en Attente (Hors-Ligne)", val: "142", icon: <Clock size={16}/>, color: "text-amber-400", border: "border-amber-500/30" },
             { label: "Échecs de Transfert", val: "12", icon: <AlertTriangle size={16}/>, color: "text-rose-400", border: "border-rose-500/30" },
             { label: "Terminaux Synchronisés", val: kpiData?.syncedDevices != null ? `${kpiData.syncedDevices}%` : "94%", icon: <Smartphone size={16}/>, color: "text-cyan-400", border: "border-cyan-500/30" },
           ].map((kpi, i) => (
             <div key={i} className={`bg-[#050914]/80 backdrop-blur-xl border ${kpi.border} rounded-2xl p-4 flex items-center gap-4 shadow-lg`}>
                <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>{kpi.icon}</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{kpi.label}</p>
                  <p className={`text-xl font-black tracking-tighter ${kpi.color}`}>{kpi.val}</p>
                </div>
             </div>
           ))}
        </div>
      </header>

      {/* ==========================================
          MAIN GRID : GRAPHIQUES & TERMINAL
      ========================================== */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* COLONNE GAUCHE (Graphiques & Sync) */}
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
          
          {/* Graphique Rendement Horaire */}
          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-400" /> Rendement de Collecte (Direct)
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase"><span className="w-2 h-2 rounded bg-cyan-500" /> Données Sync</div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase"><span className="w-2 h-2 rounded bg-amber-500" /> Mises en cache</div>
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                  <Area type="monotone" dataKey="offline" stroke="#f59e0b" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* État de Synchronisation des Régions */}
          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl h-64 flex flex-col">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Signal size={16} className="text-purple-500" /> État des Réseaux & Tablettes
            </h3>
            
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {DEVICE_STATUS.map((zone, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-slate-500" /> {zone.region}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                      zone.status === 'optimal' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                      zone.status === 'warning' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    }`}>
                      {zone.synced}% SYNC
                    </span>
                  </div>
                  
                  {/* Barre de progression bicolore */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${zone.synced}%` }} />
                    <div className="h-full bg-amber-500" style={{ width: `${zone.pending}%` }} />
                  </div>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-2 text-right">
                    {zone.pending}% paquets en attente
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (Terminal Live Feed) */}
        <div className="col-span-12 xl:col-span-4 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <Server size={16} className="text-emerald-400" /> Terminal Réception
            </h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex-1 overflow-hidden p-2 relative">
            {/* Effet de fondu en bas */}
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#050914] to-transparent z-10 pointer-events-none" />
            
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {liveFeed.map((entry) => (
                  <motion.div 
                    key={entry.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group"
                  >
                    {/* Ligne lumineuse à gauche selon le statut */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      entry.status === 'synced' ? 'bg-emerald-500' :
                      entry.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />

                    <div className="flex justify-between items-start pl-2">
                      <div>
                        <p className="text-[10px] font-mono font-black text-cyan-400 tracking-widest">{entry.id}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{entry.agent}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="text-slate-500" />
                        <span className="text-[9px] font-mono text-slate-500">{entry.time}</span>
                      </div>
                    </div>

                    <div className="pl-2 pt-1 flex justify-between items-end">
                      <div>
                        <p className="text-xs font-black text-white uppercase">{entry.type}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {entry.zone}
                        </p>
                      </div>
                      
                      {/* Icône de Statut Crypté */}
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/5">
                        {entry.status === 'synced' ? <ShieldCheck size={12} className="text-emerald-400" /> :
                         entry.status === 'pending' ? <Wifi size={12} className="text-amber-400 animate-pulse" /> :
                         <AlertTriangle size={12} className="text-rose-400" />}
                        <span className={entry.status === 'synced' ? 'text-emerald-400' : entry.status === 'pending' ? 'text-amber-400' : 'text-rose-400'}>
                          {entry.status === 'synced' ? 'Crypté' : entry.status === 'pending' ? 'En cache' : 'Échec'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}