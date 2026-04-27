// src/pages/MainDashboard.tsx
import React, { useEffect, useState } from "react";
import IncidentMap from "./Security/IncidentMap";
import { 
  Users, Baby, Skull, ShieldAlert, TrendingUp, 
  MapPin, Activity, ArrowUpRight, ArrowDownRight,
  Globe, Car, FileSignature, Download, Filter
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import { apiService } from "../services/apiService";

// --- DONNÉES STATIQUES FALLBACK ---
const DEFAULT_DEMOGRAPHIC_DATA = [
  { month: "Jan", naissances: 4000, deces: 1200 },
  { month: "Fév", naissances: 3000, deces: 1100 },
  { month: "Mar", naissances: 5000, deces: 1300 },
  { month: "Avr", naissances: 4500, deces: 1050 },
  { month: "Mai", naissances: 6000, deces: 1400 },
  { month: "Juin", naissances: 5500, deces: 1250 },
  { month: "Juil", naissances: 7000, deces: 1500 },
];

const regionalData = [
  { name: "Abidjan", value: 45 },
  { name: "Bouaké", value: 15 },
  { name: "San Pédro", value: 12 },
  { name: "Yamoussoukro", value: 10 },
  { name: "Korhogo", value: 18 },
];

const securityData = [
  { name: "Lun", accidents: 12, crimes: 3 },
  { name: "Mar", accidents: 19, crimes: 2 },
  { name: "Mer", accidents: 15, crimes: 5 },
  { name: "Jeu", accidents: 22, crimes: 1 },
  { name: "Ven", accidents: 30, crimes: 7 },
  { name: "Sam", accidents: 45, crimes: 12 },
  { name: "Dim", accidents: 38, crimes: 9 },
];

const COLORS = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

interface DashboardData {
  citizens: { total: number; pending: number; validated: number; suspect: number };
  vitalEvents: { births: number; deaths: number; marriages: number; divorces: number; migrations: number };
  agents: number;
  incidents: number;
}

const MainDashboard: React.FC = () => {
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [demographicData, setDemographicData] = useState(DEFAULT_DEMOGRAPHIC_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, trend] = await Promise.all([
          apiService.get<DashboardData>('/analytics/dashboard'),
          apiService.get<typeof DEFAULT_DEMOGRAPHIC_DATA>('/analytics/trend'),
        ]);
        setDashData(dash);
        if (Array.isArray(trend) && trend.length > 0) setDemographicData(trend);
      } catch {
        // keep static fallback values
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatPop = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* HEADER PREMIUM AVEC ACTIONS IX */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Tableau de Bord National</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase">Mise à jour en temps réel • Côte d'Ivoire</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 active:scale-95">
            <Download size={18} />
            <span>Exporter le Rapport</span>
          </button>
        </div>
      </div>

      {/* 1. KPIs AVEC EFFETS DE SURVOL */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-4 flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
          </div>
        ) : (
          <>
            <KpiCard title="Population Enrôlée" value={dashData ? formatPop(dashData.citizens.total) : "28.5M"} trend="+2.4%" positive icon={<Users size={24} />} color="text-blue-600" bg="bg-blue-50" />
            <KpiCard title="Naissances (Mensuel)" value={dashData ? dashData.vitalEvents.births.toLocaleString() : "12,400"} trend="+5.1%" positive icon={<Baby size={24} />} color="text-emerald-600" bg="bg-emerald-50" />
            <KpiCard title="Taux de Couverture" value="94.2%" trend="+0.8%" positive icon={<Globe size={24} />} color="text-orange-600" bg="bg-orange-50" />
            <KpiCard title="Alertes Sécurité" value={dashData ? String(dashData.incidents) : "14"} trend="-2.0%" positive icon={<ShieldAlert size={24} />} color="text-red-600" bg="bg-red-50" />
          </>
        )}
      </div>

      {/* 2. CARTOGRAPHIE (IX : FOCUS CARTE) */}
      <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden h-[500px] lg:h-[650px] group transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
         <div className="flex justify-between items-center px-6 pt-2 pb-6 border-b border-slate-50 mb-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={16} /></span>
              Cartographie Dynamique du Territoire
            </h3>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />)}
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase">12 Agents Actifs</span>
            </div>
         </div>
         <div className="flex-1 w-full rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 relative shadow-inner group-hover:border-blue-100 transition-colors">
           <IncidentMap />
         </div>
      </div>

      {/* 3. GRAPHIQUES & ACTIVITÉ (MIXTE DARK/LIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={16} /></span>
              Vitalité Démographique
            </h3>
            <select className="bg-slate-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none cursor-pointer">
              <option>Semestre 1</option>
              <option>Semestre 2</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demographicData}>
                <defs>
                  <linearGradient id="gradNaissances" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} />
                <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="naissances" stroke="#10b981" strokeWidth={4} fill="url(#gradNaissances)" animationDuration={2000} />
                <Area type="monotone" dataKey="deces" stroke="#94a3b8" strokeWidth={4} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <h3 className="text-xs font-black text-blue-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <Activity size={18} /> Flux National Live
          </h3>
          <div className="space-y-6 relative z-10 h-[300px] overflow-y-auto custom-scrollbar pr-2">
            <ActivityItem type="Naissance" loc="Cocody, CHU Angré" time="2m" icon={<Baby size={16} />} color="text-emerald-400 bg-emerald-400/10 border-emerald-400/20" />
            <ActivityItem type="Recensement" loc="Yamoussoukro" time="5m" icon={<FileSignature size={16} />} color="text-blue-400 bg-blue-400/10 border-blue-400/20" />
            <ActivityItem type="Accident" loc="Autoroute Nord" time="18m" icon={<Car size={16} />} color="text-orange-400 bg-orange-400/10 border-orange-400/20" />
            <ActivityItem type="Homicide" loc="Abobo" time="45m" icon={<ShieldAlert size={16} />} color="text-red-400 bg-red-400/10 border-red-400/20" />
          </div>
          <button className="w-full mt-8 py-5 bg-white/5 hover:bg-white/10 text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all border border-white/5">
            Explorer le Journal
          </button>
        </div>
      </div>

      {/* 4. ANALYSE REGIONALE (DESIGN CARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-xs font-black text-slate-800 self-start uppercase tracking-widest mb-8">Répartition Régionale</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={regionalData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {regionalData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
           <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8">Incidents Sécuritaires (7j)</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={securityData} barGap={8}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="accidents" fill="#f97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="crimes" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MINI-COMPOSANTS ---
const KpiCard = ({ title, value, trend, positive, icon, color, bg }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-[1.2rem] ${bg} ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {trend}
      </div>
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ type, loc, time, icon, color }: any) => (
  <div className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
    <div className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-100">{type}</p>
      <p className="text-[11px] text-slate-500 font-medium">{loc}</p>
    </div>
    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{time}</span>
  </div>
);

export default MainDashboard;