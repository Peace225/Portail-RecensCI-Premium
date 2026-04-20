import React from 'react';
import { Shield, Crosshair, Fingerprint, AlertOctagon, Siren, Activity } from 'lucide-react';

export default function PoliceDashboard() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <header className="border-b border-blue-500/20 pb-6 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/30 flex items-center gap-2">
              <Siren size={12} className="animate-pulse" /> Niveau d'Alerte : VIGILANCE
            </span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <Shield className="text-blue-500" size={36} />
            Préfecture de <span className="text-blue-400">Police</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Centre des Opérations Tactiques | District Abidjan
          </p>
        </div>
      </header>

      {/* KPI Tactiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Contrôles Biométriques (24h)", val: "3,402", icon: <Fingerprint />, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Unités Déployées", val: "84", icon: <Crosshair />, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Alertes Fichier Criminel", val: "12", icon: <AlertOctagon />, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Taux de Résolution AFIS", val: "99.1%", icon: <Activity />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((kpi, i) => (
          <div key={i} className="bg-[#050914] border border-blue-500/10 p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${kpi.color}`}>
              {React.cloneElement(kpi.icon as React.ReactElement, { size: 48 })}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
         {/* Espace réservé pour la Heatmap ou le tracking GPS */}
         <div className="bg-[#050914] border border-blue-500/10 rounded-[2rem] p-6 h-96 flex flex-col items-center justify-center text-slate-600">
            <Crosshair size={48} className="mb-4 text-blue-500/30" />
            <p className="text-xs font-black uppercase tracking-widest">Carte de Déploiement (En attente du module GPS)</p>
         </div>
         {/* Espace réservé pour le Flux vidéo CCTV */}
         <div className="bg-[#050914] border border-blue-500/10 rounded-[2rem] p-6 h-96 flex flex-col items-center justify-center text-slate-600 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] text-red-500 font-black uppercase"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"/> REC</div>
            <Activity size={48} className="mb-4 text-cyan-500/30" />
            <p className="text-xs font-black uppercase tracking-widest">Flux Vidéosurveillance Live</p>
         </div>
      </div>
    </div>
  );
}