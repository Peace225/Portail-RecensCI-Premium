// src/components/NavigationTelemetry.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Activity, Radio, Database, Shield } from "lucide-react";

const NavigationTelemetry = () => {
  const location = useLocation();
  const [ping, setPing] = useState(24);
  const [dataFlow, setDataFlow] = useState("0.0 kb/s");

  // Simulation de données dynamiques
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * (35 - 12 + 1) + 12));
      setDataFlow((Math.random() * 10).toFixed(1) + " mb/s");
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Transformation de l'URL en chemin "Terminal"
  const pathParts = location.pathname.split("/").filter((x) => x);
  const currentPath = ["ROOT", ...pathParts.map((p) => p.toUpperCase())];

  return (
    <div className="hidden md:flex fixed top-12 left-8 z-[150] items-start gap-6 font-mono pointer-events-none">
      {/* Fil d'ariane style Terminal */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-slate-500 text-[8px] uppercase tracking-[0.3em] font-black">
          <Database size={10} /> Sequence_Path
        </div>
        <div className="flex items-center gap-2">
          {currentPath.map((part, index) => (
            <React.Fragment key={index}>
              <span className={`text-[10px] font-bold tracking-widest ${
                index === currentPath.length - 1 ? "text-orange-500" : "text-white/40"
              }`}>
                {part}
              </span>
              {index < currentPath.length - 1 && (
                <span className="text-slate-800 text-[10px]">{">"}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Barre de séparation verticale */}
      <div className="w-px h-8 bg-white/5 self-end" />

      {/* Métriques Live */}
      <div className="flex items-center gap-6 self-end pb-0.5">
        <div className="flex flex-col">
          <span className="text-slate-600 text-[7px] uppercase font-black tracking-tighter">Latency</span>
          <span className="text-white text-[9px] font-bold">{ping}ms</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 text-[7px] uppercase font-black tracking-tighter">Signal</span>
          <div className="flex gap-0.5 mt-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-1 h-2 rounded-full ${i <= 3 ? "bg-orange-500" : "bg-slate-800"}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 text-[7px] uppercase font-black tracking-tighter">Encryption</span>
          <div className="flex items-center gap-1">
             <Shield size={8} className="text-emerald-500" />
             <span className="text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationTelemetry;