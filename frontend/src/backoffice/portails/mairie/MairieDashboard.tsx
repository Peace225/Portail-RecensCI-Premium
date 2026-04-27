import React, { useEffect, useState } from 'react';
import { 
  Landmark, Users, FileText, DollarSign, 
  TrendingUp, ArrowUpRight, Calendar, Download 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { apiService } from '../../../services/apiService';

// --- DONNÉES FINANCIÈRES SIMULÉES ---
const REVENUE_HISTORY = [
  { day: 'Lun', montant: 450000 },
  { day: 'Mar', montant: 520000 },
  { day: 'Mer', montant: 480000 },
  { day: 'Jeu', montant: 610000 },
  { day: 'Ven', montant: 590000 },
  { day: 'Sam', montant: 750000 },
  { day: 'Dim', montant: 400000 },
];

const TAX_BREAKDOWN = [
  { name: 'État Civil', value: 1200000, color: '#f59e0b' }, // Amber
  { name: 'Taxes Marchés', value: 2500000, color: '#10b981' }, // Emerald
  { name: 'Voirie/Parking', value: 1800000, color: '#06b6d4' }, // Cyan
];

interface MairieData {
  births: number;
  marriages: number;
  divorces: number;
  pendingEvents: number;
  revenue: number;
}

export default function MairieDashboard() {
  const [mairieData, setMairieData] = useState<MairieData | null>(null);

  useEffect(() => {
    apiService.get<MairieData>('/analytics/mairie').then(setMairieData).catch(() => {});
  }, []);

  const documentsDelivres = mairieData ? mairieData.births + mairieData.marriages : 1450;

  return (
    <div className="p-8 space-y-8 bg-[#020617] min-h-screen text-slate-300">
      
      {/* --- HEADER --- */}
      <header className="border-b border-white/5 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
            <Landmark className="text-amber-500" size={40} />
            DASHBOARD <span className="text-amber-500">FINANCIER</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
            République de Côte d'Ivoire • Trésorerie Communale
          </p>
        </div>
        <div className="flex gap-3">
           <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
              <Calendar size={16} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase text-white">Mars 2026</span>
           </div>
           <button className="p-3 bg-amber-500 text-slate-950 rounded-2xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">
              <Download size={20} />
           </button>
        </div>
      </header>

      {/* --- CARTES KPI --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Recettes Totales (Semaine)" 
          value="3 800 000" 
          unit="FCFA"
          trend="+18%" 
          icon={<DollarSign className="text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="Documents Délivrés" 
          value={documentsDelivres.toLocaleString()} 
          unit="UNITÉS"
          trend="+5.2%" 
          icon={<FileText className="text-amber-500" />} 
          color="amber"
        />
        <StatCard 
          title="Taux de Recouvrement" 
          value="92.4" 
          unit="%"
          trend="+2.1%" 
          icon={<TrendingUp className="text-cyan-400" />} 
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- GRAPHIQUE AREA : ÉVOLUTION DES RECCETTES --- */}
        <div className="col-span-12 lg:col-span-8 bg-[#050914] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={16} className="text-amber-500" /> Flux des encaissements (FCFA)
            </h3>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_HISTORY}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '15px', fontSize: '10px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="montant" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- GRAPHIQUE BAR : RÉPARTITION --- */}
        <div className="col-span-12 lg:col-span-4 bg-[#050914] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
            RÉPARTITION PAR DIRECTION
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TAX_BREAKDOWN} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight="black" width={80} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '10px', fontSize: '10px' }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                  {TAX_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 space-y-4">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Top Performance</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-white">Taxes Marchés</span>
              <span className="text-xs font-black text-emerald-500">2.5M FCFA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SOUS-COMPOSANT CARD ---
function StatCard({ title, value, unit, trend, icon, color }: any) {
  return (
    <div className="bg-[#050914] border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group hover:border-white/10 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 bg-${color}-500/10 rounded-2xl group-hover:scale-110 transition-transform border border-${color}-500/20`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14}/> {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
          <p className="text-xs font-black text-slate-600 uppercase">{unit}</p>
        </div>
      </div>
      
      {/* Effet Cyber en fond */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color}-500/5 blur-[50px] rounded-full opacity-50`} />
    </div>
  );
}