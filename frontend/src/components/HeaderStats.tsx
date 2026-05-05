// src/components/HeaderStats.tsx
import React from "react";
import { ShieldCheck, Cpu, Lock, Activity, Globe } from "lucide-react";

const HeaderStats = () => {
  const stats = [
    { label: "SÉCURITÉ", value: "NIVEAU 5", icon: <ShieldCheck size={10} />, color: "text-emerald-500" },
    { label: "NŒUDS ACTIFS", value: "4,829", icon: <Cpu size={10} />, color: "text-orange-500" },
    { label: "ENCRYPTAGE", value: "AES-512", icon: <Lock size={10} />, color: "text-blue-500" },
    { label: "STATUT SYSTÈME", value: "OPÉRATIONNEL", icon: <Activity size={10} />, color: "text-emerald-500" },
    { label: "IA SOUVERAINE", value: "ACTIVE", icon: <Globe size={10} />, color: "text-orange-500" },
  ];

  const scrollingStats = [...stats, ...stats, ...stats];

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-black/80 backdrop-blur-md border-b border-white/5 z-[250] flex items-center overflow-hidden">
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { display: flex; white-space: nowrap; animation: scroll 30s linear infinite; }
      `}</style>
      <div className="animate-ticker">
        {scrollingStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-6 px-8">
            <div className="flex items-center gap-2">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label} :</span>
              <span className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">{stat.value}</span>
            </div>
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full px-4 bg-black/90 backdrop-blur-md border-l border-white/5 flex items-center gap-2 z-10">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live Sync</span>
      </div>
    </div>
  );
};

export default HeaderStats;