import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, UserPlus, MapPin, Activity, 
  Crosshair, BatteryMedium, Radio, Navigation, 
  PhoneCall, ShieldAlert, Cpu
} from 'lucide-react';

// --- Données Simulées Enrichies (Tracking & Télémétrie) ---
const MAIRIE_AGENTS = [
  { id: "AGN-YOP-001", name: "KOUASSI Jean", role: "DEPT_HEAD", department: "État Civil", service: "Supervision", status: "online", phone: "01 02 03 04 05", location: "Mairie Centrale - Bureau 12", coords: { x: 50, y: 50 }, task: "Validation des registres", battery: 85, signal: "Fort" },
  { id: "AGN-YOP-045", name: "TRAORE Seydou", role: "SERVICE_HEAD", department: "État Civil", service: "Naissances", status: "online", phone: "07 08 09 10 11", location: "CHU de Yopougon (Guichet Annexe)", coords: { x: 70, y: 25 }, task: "Enrôlement naissances", battery: 42, signal: "Moyen" },
  { id: "AGN-YOP-112", name: "BAMBA Aminata", role: "AGENT", department: "État Civil", service: "Mariages", status: "offline", phone: "05 06 07 08 09", location: "Dernière pos: Mairie Centrale", coords: { x: 48, y: 52 }, task: "Hors service", battery: 0, signal: "Perdu" },
  { id: "AGN-YOP-089", name: "YAO Akissi", role: "AGENT", department: "Urbanisme", service: "Terrain", status: "online", phone: "01 44 55 66 77", location: "Yopougon Niangon Nord", coords: { x: 20, y: 60 }, task: "Inspection de chantier d'État", battery: 90, signal: "Fort" },
  { id: "AGN-YOP-201", name: "KONE Yacouba", role: "AGENT", department: "Police Municipale", service: "Patrouille", status: "alert", phone: "07 88 99 00 11", location: "Marché de Siporex", coords: { x: 80, y: 75 }, task: "Intervention suite plainte (Nuisance)", battery: 15, signal: "Faible" },
];

export default function MairieAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(MAIRIE_AGENTS[0].id);
  
  // Effet visuel pour simuler la mise à jour des coordonnées GPS
  const [liveGps, setLiveGps] = useState("5.3364° N, -4.0267° W");

  useEffect(() => {
    const interval = setInterval(() => {
      const jitter1 = (Math.random() * 0.0001).toFixed(4);
      const jitter2 = (Math.random() * 0.0001).toFixed(4);
      setLiveGps(`5.33${jitter1.substring(2)}° N, -4.02${jitter2.substring(2)}° W`);
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedAgentId]);

  const filteredAgents = MAIRIE_AGENTS.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedAgent = MAIRIE_AGENTS.find(a => a.id === selectedAgentId) || MAIRIE_AGENTS[0];

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'DEPT_HEAD': return <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-amber-500/30">Directeur</span>;
      case 'SERVICE_HEAD': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-blue-500/30">Chef Service</span>;
      default: return <span className="bg-slate-500/20 text-slate-400 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-slate-500/30">Agent Terrain</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto h-full flex flex-col min-h-screen">
      
      {/* HEADER */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <Users className="text-amber-500" size={32} />
            Déploiement <span className="text-amber-400">& Tracking</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Activity size={14} className="text-emerald-500 animate-pulse"/> Surveillance des unités sur le terrain
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
            <input 
              type="text" placeholder="MATRICULE OU NOM..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#050914] border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs w-full focus:outline-none focus:border-amber-500/50 transition-all uppercase text-white shadow-inner"
            />
          </div>
          <button className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0">
            <UserPlus size={18} /> <span className="hidden md:inline">Enrôler Agent</span>
          </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* COLONNE GAUCHE : Liste des Agents */}
        <div className="col-span-12 lg:col-span-4 bg-[#050914] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Effectif Opérationnel</h3>
            <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-lg">{filteredAgents.length} Agents</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <button 
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full text-left p-4 rounded-3xl transition-all border flex items-center gap-4 group ${
                    selectedAgentId === agent.id 
                    ? 'bg-amber-500/10 border-amber-500/30' 
                    : 'bg-transparent border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-white font-black">
                      {agent.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#050914] ${
                      agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'alert' ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-xs font-black uppercase truncate ${selectedAgentId === agent.id ? 'text-amber-400' : 'text-white group-hover:text-amber-200'}`}>
                        {agent.name}
                      </h4>
                    </div>
                    <p className="text-[9px] font-mono text-slate-500 tracking-widest truncate">{agent.id}</p>
                  </div>
                  
                  <div className="shrink-0 text-right">
                    {getRoleBadge(agent.role)}
                  </div>
                </button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* COLONNE DROITE : Télémétrie et Radar */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* ZONE CARTE / RADAR */}
          <div className="h-[400px] bg-[#020617] border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl group">
            {/* Arrière-plan "Carte" stylisé */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617] z-0" />
            
            {/* Ligne de scan Radar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,1)] z-10 animate-[scan-v_4s_linear_infinite]" />

            {/* Points sur la carte */}
            {MAIRIE_AGENTS.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              const isAlert = agent.status === 'alert';
              const isOffline = agent.status === 'offline';
              
              return (
                <div 
                  key={agent.id} 
                  className={`absolute z-20 transition-all duration-1000 ${isSelected ? 'scale-150 z-30' : 'scale-100 opacity-60'}`}
                  style={{ top: `${agent.coords.y}%`, left: `${agent.coords.x}%` }}
                >
                  <div className={`relative flex items-center justify-center ${isAlert ? 'text-rose-500' : isOffline ? 'text-slate-500' : 'text-emerald-500'}`}>
                    <Navigation size={isSelected ? 24 : 16} className={`drop-shadow-lg ${isAlert ? 'animate-pulse' : ''}`} fill="currentColor" />
                    
                    {isSelected && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl whitespace-nowrap">
                        <p className="text-[9px] font-black text-white uppercase tracking-widest">{agent.name}</p>
                        <p className="text-[8px] font-mono text-amber-500">{liveGps}</p>
                      </div>
                    )}
                    
                    {/* Ripple effect */}
                    {!isOffline && (
                      <div className={`absolute w-full h-full rounded-full animate-ping opacity-30 ${isAlert ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Overlay Info Radar */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
              <Crosshair size={16} className="text-amber-500" />
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Secteur Communal Actif</span>
            </div>
          </div>

          {/* ZONE TÉLÉMÉTRIE (Détails Agent Sélectionné) */}
          <div className="flex-1 bg-[#050914] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full relative z-10">
              
              {/* Infos Gauche */}
              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedAgent.name}</h2>
                    {selectedAgent.status === 'alert' && (
                      <span className="bg-rose-500/20 text-rose-500 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-rose-500/30 flex items-center gap-1 animate-pulse">
                        <ShieldAlert size={12}/> Alerte
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">{selectedAgent.department} • {selectedAgent.service}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mission en cours</p>
                    <p className="text-xs font-bold text-white leading-tight">{selectedAgent.task}</p>
                  </div>
                  <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Dernière localisation connue</p>
                    <p className="text-xs font-bold text-slate-300 flex items-center gap-1"><MapPin size={12} className="text-amber-500"/> {selectedAgent.location}</p>
                  </div>
                </div>
              </div>

              {/* Télémétrie Droite */}
              <div className="w-full md:w-64 space-y-3 shrink-0">
                <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BatteryMedium size={18} className={selectedAgent.battery < 20 ? "text-rose-500" : "text-emerald-500"} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Terminal</span>
                  </div>
                  <span className={`text-xs font-black ${selectedAgent.battery < 20 ? "text-rose-500" : "text-white"}`}>{selectedAgent.battery}%</span>
                </div>
                
                <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio size={18} className={selectedAgent.signal === 'Perdu' ? "text-slate-500" : "text-blue-400"} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Liaison</span>
                  </div>
                  <span className="text-xs font-black text-white">{selectedAgent.signal}</span>
                </div>

                <div className="bg-[#020617] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu size={18} className="text-purple-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</span>
                  </div>
                  <span className="text-[10px] font-mono text-white">{selectedAgent.phone}</span>
                </div>

                <button className={`w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedAgent.status === 'offline' 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                }`}>
                  <PhoneCall size={14} /> Contacter l'unité
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes scan-v { 
          0% { top: -10%; opacity: 0; } 
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; } 
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.5); }
      `}</style>
    </div>
  );
}