import React, { useMemo } from 'react';
import { useSelector } from 'react-redux'; 
import { RootState } from "../../../store"; 
import { 
  BarChart3, Users, Clock, AlertCircle, 
  Layers, ChevronRight, Zap, Target, ArrowUpRight, ShieldCheck, Calendar
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

// --- Données de Performance Simulées ---
const DATA_PERF = [
  { service: 'Naissances', dossiers: 450 },
  { service: 'Mariages', dossiers: 120 },
  { service: 'Décès', dossiers: 85 },
  { service: 'Légalisations', dossiers: 890 },
];

export default function DirecteurDashboard() {
  const { name, commune } = useSelector((state: RootState) => state.user);
  
  const communeName = (commune && commune !== "Inconnue") 
    ? commune 
    : (localStorage.getItem('commune_secours') || "Abidjan");

  return (
    <div className="p-6 md:p-8 space-y-8 w-full text-slate-300 font-sans overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* --- HEADER DE DIRECTION --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={10} /> Niveau 2 : Direction
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
            Services <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Administratifs</span>
          </h1>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">
            Supervision Stratégique • {name || "Directeur des Services"}
          </p>
        </div>
        
        <div className="flex gap-3">
           <div className="px-4 py-2.5 bg-[#050914] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-lg">
              <Target size={16} className="text-blue-500" />
              <div className="flex flex-col">
                <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest">Objectif</span>
                <span className="text-[10px] font-black uppercase text-white">88% Atteint</span>
              </div>
           </div>
           <div className="px-4 py-2.5 bg-[#050914] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-lg">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase text-white">Avril 2026</span>
           </div>
        </div>
      </header>

      {/* --- KPI DE DIRECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Dossiers Traités" value="1,545" trend="+12.5%" icon={<Layers size={20}/>} colorTheme="blue" />
        <KPICard title="Délai Moyen" value="18.5h" trend="-2.4h" icon={<Clock size={20}/>} colorTheme="amber" />
        <KPICard title="Effectif Live" value="24 / 28" trend="En service" icon={<Users size={20}/>} colorTheme="emerald" />
        <KPICard title="Alertes" value="03" trend="Critique" icon={<AlertCircle size={20}/>} colorTheme="rose" />
      </div>

      <div className="grid grid-cols-12 gap-6 pb-4">
        
        {/* --- GRAPHIQUE RENDEMENT --- */}
        <div className="col-span-12 lg:col-span-8 bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] shadow-2xl flex flex-col min-h-[350px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Rendement Opérationnel</h3>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Volume de dossiers par service</p>
            </div>
            <button className="text-[9px] font-black text-blue-400 uppercase hover:text-blue-300 transition-colors">Détails agents</button>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DATA_PERF} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="service" stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} 
                />
                <Bar dataKey="dossiers" radius={[6, 6, 0, 0]} barSize={40}>
                  {DATA_PERF.map((entry, index) => (
                    <Cell key={index} fill={index === 3 ? '#3b82f6' : '#1e293b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- PERFORMANCE DES CHEFS DE SERVICE --- */}
        <div className="col-span-12 lg:col-span-4 bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] shadow-2xl flex flex-col">
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-6">Management Performance</h3>
          
          <div className="space-y-4 flex-1">
            <ChefRow name="S. Traoré" service="État Civil" score="94%" colorClass="bg-emerald-500" />
            <ChefRow name="A. Bamba" service="Élections" score="78%" colorClass="bg-amber-500" />
            <ChefRow name="P. Koffi" service="Archives" score="82%" colorClass="bg-blue-500" />
          </div>

          <button className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
            Réunion de Direction <Zap size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function KPICard({ title, value, trend, icon, colorTheme }: any) {
  const themes = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", line: "bg-blue-500", text: "text-blue-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", line: "bg-amber-500", text: "text-amber-400" },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", line: "bg-emerald-500", text: "text-emerald-400" },
    rose: { bg: "bg-rose-500/10", border: "border-rose-500/20", line: "bg-rose-500", text: "text-rose-400" },
  } as any;
  const theme = themes[colorTheme] || themes.blue;

  return (
    <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-5 rounded-[1.5rem] relative overflow-hidden group transition-all">
      <div className={`absolute top-0 left-0 w-full h-1 ${theme.line} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 ${theme.bg} rounded-xl border ${theme.border} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <div className="text-[9px] font-black text-white bg-white/10 px-2 py-1 rounded-md flex items-center gap-1"><ArrowUpRight size={10} className={theme.text} /> {trend}</div>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5"><p className="text-3xl font-black text-white tracking-tighter">{value}</p></div>
      </div>
    </div>
  );
}

function ChefRow({ name, service, score, colorClass }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-xl group hover:border-blue-500/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-xs font-black text-white uppercase">{name}</p>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{service}</p>
        </div>
        <p className="text-xs font-black text-white">{score}</p>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} transition-all`} style={{ width: score }} />
      </div>
    </div>
  );
}