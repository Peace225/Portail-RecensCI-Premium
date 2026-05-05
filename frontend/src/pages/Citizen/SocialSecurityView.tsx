// src/pages/citizen/SocialSecurityView.tsx
import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, GraduationCap, ArrowRight, Clock, 
  TrendingUp, Landmark, ShieldAlert, Wallet, 
  Activity, Zap, Download, BarChart3
} from "lucide-react";

// --- CONFIGURATION DU GRAPHIQUE (DATA) ---
const chartData = [30, 45, 35, 60, 55, 70, 65, 80, 75, 90, 85, 100]; // Évolution simulée
const months = ["AVR", "MAI", "JUI", "JUL", "AOU", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"];

const SocialSecurityView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-10 pt-24 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND DIGITAL --- */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(59,130,246,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* --- 1. HEADER & SOLDE (Version Ultra-IA) --- */}
        <div className="relative overflow-hidden glass-hud p-10 md:p-16 rounded-[4rem] border-l-4 border-l-blue-600 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Protection Souveraine Active
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter italic uppercase text-white leading-tight">
                Patrimoine <br /> <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Social</span>
              </h1>
            </div>

            <div className="glass-hud p-8 rounded-[3.5rem] w-full md:w-96 border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Flux Mensuel</p>
                <Activity size={16} className="text-emerald-500 animate-pulse" />
              </div>
              <h2 className="text-5xl font-black text-white italic">425.000 <span className="text-xs text-blue-500 uppercase not-italic">CFA</span></h2>
              <button className="w-full mt-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                Détails des virements
              </button>
            </div>
          </div>
        </div>

        {/* --- 2. GRAPHIQUE NÉON (FLUX 12 MOIS) --- */}
        <div className="glass-hud p-10 rounded-[4rem] border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
             <div className="space-y-1">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                   <TrendingUp size={18} className="text-blue-500" /> Analyse de Croissance Sociale
                </h3>
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Période: AVR 2025 - MAR 2026</p>
             </div>
             <div className="flex gap-2">
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[8px] font-black text-blue-400 uppercase">Live_Node</div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-400 uppercase">Stable</div>
             </div>
          </div>

          {/* ZONE DU GRAPHIQUE SVG */}
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 1200 300" className="w-full h-full overflow-visible">
              {/* Lignes de Grille Horizontales */}
              {[0, 100, 200].map((y) => (
                <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              ))}

              {/* Courbe Néon */}
              <motion.path
                d={`M ${chartData.map((val, i) => `${(i * 1100) / 11},${250 - val * 2}`).join(" L ")}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))" }}
              />

              {/* Remplissage Dégradé sous la courbe */}
              <motion.path
                d={`M 0,300 L ${chartData.map((val, i) => `${(i * 1100) / 11},${250 - val * 2}`).join(" L ")} L 1100,300 Z`}
                fill="url(#gradient-social)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1, duration: 1 }}
              />

              <defs>
                <linearGradient id="gradient-social" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Points de données */}
              {chartData.map((val, i) => (
                <motion.circle
                  key={i}
                  cx={(i * 1100) / 11}
                  cy={250 - val * 2}
                  r="4"
                  fill="#3b82f6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                  className="cursor-pointer hover:r-6 transition-all"
                />
              ))}
            </svg>

            {/* Labels des mois */}
            <div className="flex justify-between mt-6 px-2">
              {months.map((m) => (
                <span key={m} className="text-[8px] font-mono text-slate-600 font-black">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* --- 3. PRESTATIONS & ACTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">
          <div className="lg:col-span-2 space-y-8">
            <PrestationHUDCard 
                title="Pension de Réversion"
                status="ANALYSE"
                amount="250.000"
                desc="Déclenchement biométrique suite au décès déclaré. Vérification IA en cours."
                icon={<Landmark size={24} />}
                color="blue"
              />
              <PrestationHUDCard 
                title="Bourse Éducation"
                status="VALIDE"
                amount="175.000"
                desc="Soutien scolaire universel pour Axel et Sarah. Signature numérique CI-RE-01."
                icon={<GraduationCap size={24} />}
                color="emerald"
              />
          </div>

          <aside className="space-y-8">
            <div className="glass-hud p-10 rounded-[3.5rem] border border-orange-500/20 relative group overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-500/20">
                  <Wallet size={24} />
                </div>
                <h4 className="font-black text-white text-sm uppercase">Certification RIB Requise</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Coordonnées bancaires non-cryptées.</p>
                <button className="w-full py-5 bg-slate-800 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-3">
                  Certifier mon RIB <Download size={16} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .glass-hud { background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
};

// --- COMPOSANT CARTE HUD REUTILISABLE ---
const PrestationHUDCard = ({ title, status, amount, desc, icon, color }: any) => {
  const isPending = status === "ANALYSE";
  return (
    <div className="glass-hud p-8 md:p-10 rounded-[3.5rem] border-white/5 group relative overflow-hidden transition-all duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
        <div className={`w-20 h-20 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center shrink-0`}>
          {React.cloneElement(icon, { className: `text-${color}-500` })}
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h4 className="text-2xl font-black text-white tracking-tighter italic uppercase">{title}</h4>
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mt-1">Status: {status}_PROTOCOL</p>
            </div>
            <div className="text-right">
               <p className="text-3xl font-black text-white italic tracking-tighter">{amount} <span className="text-xs text-slate-500">CFA</span></p>
               <span className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${isPending ? 'bg-orange-600 text-white animate-pulse' : 'bg-emerald-600 text-white'}`}>
                 {isPending ? <Activity size={10} /> : <ShieldCheck size={10} />}
                 {isPending ? "Analyse Biométrique" : "Virement Autorisé"}
               </span>
            </div>
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed font-medium border-l-2 border-white/10 pl-6 italic">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default SocialSecurityView;