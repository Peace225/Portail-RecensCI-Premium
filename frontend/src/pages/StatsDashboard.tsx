// src/pages/StatsDashboard.tsx
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Users, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { apiService } from "../services/apiService";

const StatsDashboard = () => {
  const [stats, setStats] = useState({ citizens: 0, births: 0, incidents: 0 });
  const [trend, setTrend] = useState([
    { name: "Lun", val: 400 }, { name: "Mar", val: 700 },
    { name: "Mer", val: 500 }, { name: "Jeu", val: 900 },
    { name: "Ven", val: 650 }, { name: "Sam", val: 1100 },
  ]);

  useEffect(() => {
    apiService.get<any>('/analytics/dashboard').then(d => {
      setStats({ citizens: d?.citizens?.total || 0, births: d?.vitalEvents?.births || 0, incidents: d?.incidents || 0 });
    }).catch(() => {});
    apiService.get<any[]>('/analytics/trend').then(d => {
      if (Array.isArray(d) && d.length) setTrend(d.map(t => ({ name: t.date || t.month, val: t.naissances || 0 })));
    }).catch(() => {});
  }, []);
    // AJUSTEMENT : pt-32 pour descendre le contenu sous le Header
    <div className="min-h-screen bg-[#020617] pt-32 p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
      
      {/* Background Decor (Optionnel pour le style) */}
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,rgba(255,130,0,0.05)_1px,transparent_1px)] [background-size:30px_30px] pointer-events-none" />

      {/* Titre de la page */}
      <div className="relative z-10 flex items-center gap-4 border-l-4 border-orange-500 pl-6">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Intelligence <span className="text-orange-500">Data</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">
            Monitoring en temps réel • Flux Souverain
          </p>
        </div>
      </div>

      {/* KPI Cards (Grille descendue également) */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Users className="text-blue-500" size={24} />} 
          label="Citoyens Enregistrés" 
          value={stats.citizens > 0 ? stats.citizens.toLocaleString() : "2.4M"} 
          trend="+12%"
        />
        <StatCard 
          icon={<Zap className="text-orange-500" size={24} />} 
          label="Naissances Enregistrées" 
          value={stats.births > 0 ? stats.births.toLocaleString() : "842"} 
          trend="Stable"
        />
        <StatCard 
          icon={<ShieldCheck className="text-emerald-500" size={24} />} 
          label="Incidents Sécurité" 
          value={stats.incidents > 0 ? stats.incidents.toLocaleString() : "0"} 
          trend="Optimal"
        />
      </div>

      {/* Graphique Néon (Zone principale) */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3.5rem] shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} className="text-orange-500" />
        </div>
        
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Analyse du flux de population</h3>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-orange-500 uppercase">Live Update</span>
            </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#fff' }} 
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorVal)" 
                strokeWidth={4} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] flex items-center gap-6 hover:bg-white/5 transition-all shadow-xl">
    <div className="p-5 bg-black/40 rounded-3xl group-hover:scale-110 transition-transform shadow-inner">
        {icon}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
        <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md font-bold uppercase">{trend}</span>
      </div>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  </div>
);

export default StatsDashboard;