import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Metric, Text, BadgeDelta, ProgressBar as TremorProgress } from "@tremor/react";
import { 
  AreaChart, Area, ResponsiveContainer, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { 
  ShieldAlert, Activity, Users, Scale, Sparkles, Zap, Brain, Navigation, Search, 
  Droplets, Power, CloudSun, Leaf, Wheat, ShieldCheck, FileText, Heart, Baby, UserMinus, Car
} from "lucide-react";
import 'leaflet/dist/leaflet.css';
import { apiService } from "../services/apiService";

interface DashboardData {
  citizens: { total: number; pending: number; validated: number; suspect: number };
  vitalEvents: { births: number; deaths: number; marriages: number; divorces: number; migrations: number };
  agents: number;
  incidents: number;
}

// --- DICTIONNAIRE DE COULEURS TAILWIND STRICT ---
const COLOR_MAP: Record<string, { bg: string, text: string, shadow: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-400', shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', shadow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-400', shadow: 'shadow-[0_0_10px_rgba(6,182,212,0.5)]' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
};

// --- ATLAS DE DONNÉES SOUVERAIN (ENRICHI AVEC ÉTAT CIVIL & ACCIDENTS) ---
const REGIONS_ATLAS: any = {
  "NATIONAL": { name: "CÔTE D'IVOIRE (TOTAL)", lat: 7.5399, lng: -5.5471, zoom: 7, pop: 29380000, safety: 88, crime: 14, birth: 34.2, death: 9.1, famine: 14, poverty: 35, pandemic: 12, temp: "28°C", hum: "75%", agro: 85, elevage: 45, forest: 11, green: 25, water: 82, elec: 80, health: 65, edu: 53, orphans: 4.5, widows: 3.2, marriages: 6.8, accidents: 1250, census: 92.4 },
  "ABIDJAN": { name: "ABIDJAN (LAGUNES)", lat: 5.3484, lng: -4.0244, zoom: 11, pop: 6240000, safety: 72, crime: 58, birth: 28.5, death: 7.2, famine: 5, poverty: 18, pandemic: 65, temp: "30°C", hum: "82%", agro: 12, elevage: 15, forest: 2, green: 30, water: 95, elec: 98, health: 85, edu: 82, orphans: 3.8, widows: 2.9, marriages: 8.2, accidents: 3400, census: 95.1 },
  "PORO": { name: "KORHOGO (PORO)", lat: 9.4580, lng: -5.6295, zoom: 11, pop: 780000, safety: 85, crime: 5, birth: 42.1, death: 11.2, famine: 32, poverty: 48, pandemic: 10, temp: "34°C", hum: "30%", agro: 92, elevage: 88, forest: 5, green: 15, water: 70, elec: 65, health: 50, edu: 40, orphans: 5.2, widows: 4.1, marriages: 5.4, accidents: 420, census: 88.5 },
  "GBEKE": { name: "BOUAKÉ (GBÊKÊ)", lat: 7.6934, lng: -5.0303, zoom: 11, pop: 1200000, safety: 82, crime: 15, birth: 31.5, death: 8.4, famine: 15, poverty: 35, pandemic: 24, temp: "29°C", hum: "55%", agro: 65, elevage: 55, forest: 8, green: 20, water: 78, elec: 75, health: 62, edu: 55, orphans: 4.8, widows: 3.7, marriages: 6.1, accidents: 850, census: 90.2 },
  "SAN_PEDRO": { name: "SAN-PÉDRO (BAS-SASSANDRA)", lat: 4.7485, lng: -6.6363, zoom: 11, pop: 850000, safety: 78, crime: 22, birth: 33.1, death: 8.0, famine: 10, poverty: 22, pandemic: 30, temp: "27°C", hum: "88%", agro: 55, elevage: 20, forest: 25, green: 18, water: 80, elec: 78, health: 68, edu: 58, orphans: 4.1, widows: 3.0, marriages: 7.5, accidents: 620, census: 91.8 },
  "TONKPI": { name: "MAN (TONKPI)", lat: 7.4125, lng: -7.5538, zoom: 11, pop: 920000, safety: 80, crime: 11, birth: 38.4, death: 10.1, famine: 24, poverty: 42, pandemic: 18, temp: "25°C", hum: "90%", agro: 76, elevage: 40, forest: 35, green: 40, water: 72, elec: 60, health: 55, edu: 48, orphans: 5.0, widows: 3.9, marriages: 5.8, accidents: 390, census: 87.4 },
};

const BackofficeDashboard = () => {
  const [selectedID, setSelectedID] = useState("NATIONAL");
  const [searchTerm, setSearchTerm] = useState("");
  const [targetYear, setTargetYear] = useState(2026);
  const [isPredictive, setIsPredictive] = useState(false);
  const [livePulse, setLivePulse] = useState(0);
  const [apiPop, setApiPop] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setLivePulse(p => p + 1), 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    apiService.get<DashboardData>('/analytics/dashboard')
      .then(d => setApiPop(d.citizens.total))
      .catch(() => {});
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    return Object.keys(REGIONS_ATLAS).filter(k => 
      REGIONS_ATLAS[k].name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const current = useMemo(() => {
    const base = REGIONS_ATLAS[selectedID] || REGIONS_ATLAS["NATIONAL"];
    const diff = targetYear - 2026;
    const noise = Math.floor(livePulse % 3);

    if (!isPredictive) return { ...base, pop: base.pop + noise, crime: Math.max(0, base.crime + (livePulse % 2 === 0 ? 1 : -1)) };

    return {
      ...base,
      pop: Math.floor(base.pop * (1 + diff * 0.026)),
      safety: Math.floor(base.safety * (1 - diff * 0.01)),
      crime: Math.floor(base.crime * (1 + diff * 0.042)),
      birth: (base.birth * (1 - diff * 0.005)).toFixed(1),
      death: (base.death * (1 + diff * 0.003)).toFixed(1),
      poverty: (base.poverty * (1 - diff * 0.012)).toFixed(1),
      famine: Math.min(100, base.famine + (diff * 1.5)).toFixed(0),
      pandemic: Math.min(100, base.pandemic + (diff * 0.5)).toFixed(0),
      agro: Math.max(0, base.agro - (diff * 0.8)).toFixed(0), 
      elevage: Math.min(100, base.elevage + (diff * 1.2)).toFixed(0), 
      green: Math.min(100, base.green + (diff * 2.5)).toFixed(0), 
      forest: Math.max(0, base.forest - (diff * 0.5)).toFixed(1), 
      water: Math.min(100, base.water + (diff * 0.9)).toFixed(0),
      elec: Math.min(100, base.elec + (diff * 1.1)).toFixed(0),
      health: Math.min(100, base.health + (diff * 0.7)).toFixed(0),
      edu: Math.min(100, base.edu + (diff * 0.6)).toFixed(0),
      // 👉 NOUVELLES DONNÉES PRÉDICTIVES
      orphans: (base.orphans * (1 + diff * 0.015)).toFixed(1),
      widows: (base.widows * (1 + diff * 0.01)).toFixed(1),
      marriages: (base.marriages * (1 - diff * 0.005)).toFixed(1),
      accidents: Math.floor(base.accidents * (1 + diff * 0.035)),
      census: Math.min(100, base.census + (diff * 0.4)).toFixed(1),
    };
  }, [selectedID, targetYear, isPredictive, livePulse]);

  const radarData = [
    { subject: 'EAU', val: Number(current.water), fullMark: 100 },
    { subject: 'ÉLEC', val: Number(current.elec), fullMark: 100 },
    { subject: 'SANTÉ', val: Number(current.health), fullMark: 100 },
    { subject: 'ÉDUC', val: Number(current.edu), fullMark: 100 },
  ];

  const THEME = isPredictive ? { primary: "#fbbf24", accent: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-950/10" } 
                             : { primary: "#a855f7", accent: "text-purple-400", border: "border-white/10", bg: "bg-[#020617]" };

  return (
    <div className={`flex-1 overflow-y-auto ${THEME.bg} transition-colors duration-1000 font-mono text-slate-400 selection:bg-purple-500/30`}>
      
      <style>{`
        .leaflet-tooltip { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .leaflet-tooltip::before { display: none !important; }
      `}</style>

      {/* TOPBAR COMMANDS */}
      <div className="sticky top-0 bg-[#050914]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center z-[1001]">
         <div className="flex gap-6 items-center">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
               <input 
                  type="text" placeholder="RECHERCHER RÉGION / VILLE..."
                  className="bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs w-80 focus:outline-none focus:border-purple-500/50 transition-all uppercase text-white placeholder-slate-600 shadow-inner"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
               />
               <AnimatePresence>
                 {searchTerm && (
                   <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 w-full bg-[#0a0f1c] border border-white/10 rounded-xl mt-2 shadow-2xl z-[2000] max-h-60 overflow-y-auto">
                      {searchResults.length > 0 ? searchResults.map(k => (
                        <div key={k} onClick={() => {setSelectedID(k); setSearchTerm("");}} className="p-3 text-xs hover:bg-purple-500/20 cursor-pointer uppercase font-bold border-b border-white/5 text-slate-300 last:border-0 transition-colors">
                          {REGIONS_ATLAS[k].name}
                        </div>
                      )) : <div className="p-4 text-xs text-slate-600 uppercase italic">Aucun noeud trouvé</div>}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
            <StatusBadge label="RÉSEAU" val="SÉCURISÉ" color="emerald" />
         </div>

         <div className="flex items-center gap-6">
            <div className="flex bg-slate-900/80 p-1.5 border border-white/10 rounded-xl shadow-lg">
               {[2026, 2030, 2050].map(y => (
                 <button key={y} onClick={() => {setTargetYear(y); setIsPredictive(y > 2026);}} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${targetYear === y ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'hover:bg-white/10 text-slate-400'}`}>
                   SIM_{y}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
               <div className="text-right">
                  <p className="text-xs font-black text-white uppercase italic tracking-wide">GAEL KOUHAME</p>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-0.5">SUPERVISEUR ADM</p>
               </div>
               <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                 <div className="w-full h-full bg-black rounded-full border-2 border-transparent" />
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
         <header className="flex justify-between items-end">
            <div className="space-y-3">
               <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                 RE <span className={THEME.accent}>CENSCI</span> DIGITAL_TWIN
               </h1>
               <div className="flex items-center gap-4 bg-white/5 inline-flex px-4 py-2 rounded-lg border border-white/5">
                  <span className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">
                    Nœud Actif : <span className="text-white ml-2">{current.name}</span>
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
               </div>
            </div>
         </header>

         <div className="grid grid-cols-12 gap-6">
            
            {/* GAUCHE : Démographie & État Civil */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
               <GlassCard title="Démographie Locale" icon={<Users size={18}/>} theme={THEME}>
                  <div className="flex flex-col mb-4">
                    <Metric className="text-white text-3xl font-black italic tracking-tighter truncate drop-shadow-md">
                       <LiveValue value={apiPop !== null && selectedID === "NATIONAL" ? apiPop : current.pop} isPredictive={isPredictive} />
                    </Metric>
                    <div className="mt-2 flex justify-between items-center">
                       <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Flux Humain</Text>
                       <BadgeDelta deltaType={isPredictive ? "increase" : "moderateIncrease"} className="text-xs bg-emerald-500/15 text-emerald-400 border-none font-black px-2 py-0.5 rounded">
                         {isPredictive ? `+${(targetYear-2026)*2.5}%` : "LIVE"}
                       </BadgeDelta>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4 border-t border-white/10 pt-4">
                     <GeoBit label="NATALITÉ" val={`${current.birth}%`} />
                     <GeoBit label="MORTALITÉ" val={`${current.death}%`} />
                  </div>
               </GlassCard>

               {/* 👉 NOUVEAU : Carte État Civil & Cohésion Sociale */}
               <GlassCard title="État Civil & Société" icon={<FileText size={18}/>} theme={THEME}>
                  <div className="mb-5">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Couverture Recensement</span>
                      <span className="text-sm font-black text-cyan-400">{current.census}%</span>
                    </div>
                    <TremorProgress value={Number(current.census)} color="cyan" className="h-2 rounded-full" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                    <div className="text-center">
                      <Heart size={14} className="mx-auto mb-2 text-rose-400" />
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Mariages</p>
                      <p className="text-sm font-black text-white">{current.marriages}‰</p>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <Baby size={14} className="mx-auto mb-2 text-purple-400" />
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Orphelins</p>
                      <p className="text-sm font-black text-white">{current.orphans}%</p>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <UserMinus size={14} className="mx-auto mb-2 text-amber-400" />
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Veuves</p>
                      <p className="text-sm font-black text-white">{current.widows}%</p>
                    </div>
                  </div>
               </GlassCard>

               <GlassCard title="Infrastructures Vitales" icon={<Power size={18}/>} theme={THEME}>
                  <div className="h-40 w-full -ml-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                           <PolarGrid stroke="rgba(255,255,255,0.1)" />
                           <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                           <Radar name="Conditions" dataKey="val" stroke={THEME.primary} fill={THEME.primary} fillOpacity={0.4} />
                        </RadarChart>
                     </ResponsiveContainer>
                  </div>
               </GlassCard>
            </div>

            {/* CENTRE : CARTE INTERACTIVE */}
            <div className="col-span-12 lg:col-span-6">
               <div className={`h-[740px] w-full rounded-3xl border ${THEME.border} overflow-hidden relative shadow-2xl bg-[#0a0f1c]`}>
                  <MapContainer center={[current.lat, current.lng]} zoom={current.zoom} zoomControl={false} className="w-full h-full z-0">
                     <MapController center={[current.lat, current.lng]} zoom={current.zoom} />
                     <TileLayer 
                       url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                     />
                     {Object.keys(REGIONS_ATLAS).map(key => {
                        if (key === selectedID) return null;
                        return (
                          <Polyline 
                            key={`line-${key}`}
                            positions={[[REGIONS_ATLAS[selectedID].lat, REGIONS_ATLAS[selectedID].lng], [REGIONS_ATLAS[key].lat, REGIONS_ATLAS[key].lng]]}
                            color={THEME.primary} weight={1.5} opacity={0.3} dashArray="4 8"
                          />
                        )
                     })}
                     {Object.keys(REGIONS_ATLAS).map(key => {
                       const isSelected = selectedID === key;
                       return (
                         <CircleMarker 
                           key={key} center={[REGIONS_ATLAS[key].lat, REGIONS_ATLAS[key].lng]} 
                           radius={isSelected ? 30 : 8}
                           eventHandlers={{ click: () => setSelectedID(key), mouseover: (e) => e.target.openTooltip(), mouseout: (e) => e.target.closeTooltip() }}
                           pathOptions={{ color: isSelected ? THEME.primary : '#3b82f6', fillOpacity: isSelected ? 0.4 : 0.2, weight: isSelected ? 3 : 1 }}
                         >
                           <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={isSelected}>
                             <div className={`px-3 py-1.5 rounded-lg border bg-[#050914]/90 backdrop-blur text-[10px] font-black uppercase tracking-widest ${isSelected ? 'border-purple-500/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'border-white/10 text-slate-400'}`}>
                               {REGIONS_ATLAS[key].name}
                             </div>
                           </Tooltip>
                         </CircleMarker>
                       )
                     })}
                     <CircleMarker center={[current.lat, current.lng]} radius={40} pathOptions={{ color: THEME.primary, fillOpacity: 0.05, weight: 1, dashArray: "5 10" }} />
                  </MapContainer>
                  
                  {/* Overlay Map HUD */}
                  <div className="absolute bottom-8 left-8 right-8 z-[1000] p-6 bg-[#050914]/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
                     <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-xl border ${THEME.border} bg-white/5 shadow-inner`}><CloudSun className={THEME.accent} size={28} /></div>
                        <div className="flex-1">
                           <div className="flex justify-between mb-3">
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Couverture Forestière</p>
                             <p className={`text-[10px] font-black uppercase tracking-widest ${current.forest < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{current.forest}%</p>
                           </div>
                           <TremorProgress value={Number(current.forest)} color={current.forest < 10 ? "rose" : "emerald"} className="h-2.5 rounded-full bg-slate-800" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* DROITE : Primaire & Sécurité */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
               
               <GlassCard title="Autonomie & Durabilité" icon={<Leaf size={18} />} theme={THEME}>
                  <div className="space-y-5">
                     <RiskBar label="Agro-Industrie" val={current.agro} color="emerald" icon={<Wheat size={12}/>} />
                     <RiskBar label="Ressources Élevage" val={current.elevage} color="amber" icon={<ShieldCheck size={12}/>} />
                     <RiskBar label="Énergies Renouvelables" val={current.green} color="cyan" icon={<Zap size={12}/>} />
                  </div>
               </GlassCard>

               {/* 👉 NOUVEAU : Matrice des Risques avec Accidents Routiers */}
               <GlassCard title="Matrice des Risques" icon={<Scale size={18} />} theme={THEME}>
                  <div className="space-y-5">
                     <RiskBar label="Sécurité (Crimes)" val={current.crime} displayVal={current.crime} color="rose" icon={<ShieldAlert size={12}/>} />
                     <RiskBar label="Accidents Routiers" val={Math.min(100, current.accidents/50)} displayVal={current.accidents} color="rose" icon={<Car size={12}/>} />
                     <RiskBar label="Risque Pandémique" val={current.pandemic} color="purple" />
                     <RiskBar label="Indice de Famine" val={current.famine} color="amber" />
                  </div>
               </GlassCard>

               <div className={`p-6 rounded-3xl bg-slate-900/60 border ${THEME.border} relative overflow-hidden group shadow-2xl backdrop-blur-md`}>
                  <div className="absolute -right-4 -bottom-4 opacity-10 text-cyan-500 group-hover:scale-110 transition-transform duration-700"><Brain size={120} /></div>
                  <h4 className="text-[10px] font-black text-cyan-500 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={14}/> SYNTHÈSE IA GLOBAL
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium relative z-10">
                     Simulation {targetYear} : Le recensement couvre <span className="text-white font-bold">{current.census}%</span> de la population.
                     <br/><br/>
                     <span className="text-[10px] text-slate-400">
                       {current.accidents > 1000 ? " ⚠️ Alerte rouge : Infrastructures routières saturées." : " Trafic sous contrôle."}
                       {current.elevage < 30 ? " Déficit en protéines animales." : " Secteur primaire résilient."}
                     </span>
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---
const StatusBadge = ({ label, val, color }: any) => (
  <div className="flex items-center gap-3 bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-xl shadow-inner">
    <div className={`w-2 h-2 rounded-full ${COLOR_MAP[color].bg} ${COLOR_MAP[color].shadow} animate-pulse`} />
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label} : <span className="text-white font-black">{val}</span></span>
  </div>
);

// Composant RiskBar mis à jour pour accepter une valeur d'affichage (displayVal) personnalisée
const RiskBar = ({ label, val, displayVal, color, icon }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
       <div className="flex items-center gap-1.5 text-slate-400">
         {icon && <span className={COLOR_MAP[color].text}>{icon}</span>}
         {label}
       </div>
       <span className={`${COLOR_MAP[color].text} font-black`}>{displayVal !== undefined ? displayVal : `${val}%`}</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
       <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} className={`h-full ${COLOR_MAP[color].bg} ${COLOR_MAP[color].shadow}`} />
    </div>
  </div>
);

const GeoBit = ({ label, val }: any) => (
  <div>
    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">{label}</p>
    <p className="text-sm font-black text-white font-mono">{val}</p>
  </div>
);

const GlassCard = ({ title, icon, children, theme }: any) => (
  <div className={`bg-[#050914]/60 backdrop-blur-xl border ${theme.border} p-6 rounded-3xl shadow-2xl transition-all`}>
    <div className="flex items-center gap-3 mb-6 opacity-80 border-b border-white/5 pb-4">
       <div className={theme.accent}>{icon}</div>
       <h3 className="text-xs font-bold uppercase tracking-widest text-slate-200">{title}</h3>
    </div>
    {children}
  </div>
);

const LiveValue = ({ value, isPredictive }: any) => (
  <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={isPredictive ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'text-white'}>
    {Number(value).toLocaleString()}
  </motion.span>
);

function MapController({ center, zoom }: any) {
  const map = useMap();
  useEffect(() => { 
    map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 }); 
  }, [center, zoom, map]);
  return null;
}

export default BackofficeDashboard;