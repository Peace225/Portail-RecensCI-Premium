// Page placeholder pour les modules en cours de développement
import React from "react";
import { useLocation } from "react-router-dom";
import { Cpu, Construction } from "lucide-react";

const ComingSoon: React.FC = () => {
  const location = useLocation();
  const moduleName = location.pathname.split("/").pop()?.replace(/-/g, " ").toUpperCase() || "MODULE";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10 space-y-6">
      <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl">
        <Construction size={48} className="text-orange-500 mx-auto" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{moduleName}</h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Module en cours de déploiement</p>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase">
        <Cpu size={12} className="animate-spin text-orange-500" />
        Phase 2 — Cahier des charges RecensCI
      </div>
    </div>
  );
};

export default ComingSoon;
