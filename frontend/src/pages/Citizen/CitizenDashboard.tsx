import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux"; 
import { RootState } from "../../store"; 
import { 
  Users, Database, Brain, Zap, ShieldCheck as ShieldIcon, 
  QrCode, X, Download, CheckCircle, Activity, MapPin, Fingerprint, ArrowUpRight, Cpu
} from "lucide-react";

import ProfilePhotoManager from "../../components/ProfilePhotoManager";

const styles = `
  @keyframes scan-horizontal { 0% { left: -100%; } 100% { left: 100%; } }
  .animate-scan-h { animation: scan-horizontal 3s linear infinite; }
  
  @keyframes scan-line { 0% { top: 0%; } 100% { top: 100%; } }
  .animate-scan-v { animation: scan-line 2s linear infinite; }

  @keyframes glitch {
    0% { clip-path: inset(20% 0 50% 0); transform: translate(-5px, -2px); }
    20% { clip-path: inset(60% 0 10% 0); transform: translate(5px, 2px); }
    40% { clip-path: inset(10% 0 80% 0); transform: translate(-5px, 2px); }
    60% { clip-path: inset(80% 0 5% 0); transform: translate(5px, -2px); }
    80% { clip-path: inset(30% 0 60% 0); transform: translate(-5px, -2px); }
    100% { clip-path: inset(20% 0 50% 0); transform: translate(0); }
  }
  .hover-glitch:hover {
    animation: glitch 0.3s linear infinite;
    text-shadow: 2px 0 #ff8200, -2px 0 #009e60;
  }

  .glass-hud {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
  }

  .hologram-glow {
    box-shadow: 0 0 30px rgba(255, 130, 0, 0.2), inset 0 0 20px rgba(255, 130, 0, 0.05);
  }

  .cyber-grid {
    background-image: radial-gradient(circle, rgba(255,130,0,0.05) 1px, transparent 1px);
    background-size: 30px 30px;
  }
`;

const CitizenDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const { name, nni, photoUrl } = useSelector((state: RootState) => state.user);

  const handleScanSimulation = () => {
    setScanSuccess(true);
    setTimeout(() => {
      setScanSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-20 md:pt-24 relative overflow-hidden font-sans selection:bg-orange-500/30">
      <style>{styles}</style>
      
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Resserrement des marges verticales sur mobile (space-y-5 au lieu de space-y-8) */}
      <div className="max-w-7xl mx-auto space-y-5 md:space-y-8 relative z-10">
        
        {/* --- 1. HEADER HUD COMPONENT --- */}
        {/* Paddings réduits sur mobile (p-5 au lieu de p-8) */}
        <div className="relative group overflow-hidden glass-hud p-5 md:p-12 rounded-3xl md:rounded-[3rem] border-l-4 border-l-orange-500 shadow-2xl">
          <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent animate-scan-h" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-8 relative z-10">
            <div className="flex items-center md:items-start gap-4 md:gap-6 w-full md:w-auto">
              
              {/* Photo plus petite sur mobile (w-14 h-14) */}
              <div className="shrink-0 w-14 h-14 md:w-28 md:h-28 bg-slate-900 rounded-2xl md:rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                {photoUrl ? (
                  <>
                    <img src={photoUrl} alt={`Profil`} className="w-full h-full object-cover relative z-10" />
                    <div className="absolute inset-0 border-2 md:border-[3px] border-orange-500/50 rounded-2xl md:rounded-3xl z-20 pointer-events-none" />
                  </>
                ) : (
                  <>
                    <Fingerprint size={32} className="text-orange-500 animate-pulse relative z-10 md:w-12 md:h-12" />
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent z-0" />
                  </>
                )}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-400/80 shadow-[0_0_10px_#f97316] z-30 animate-scan-v" />
              </div>

              <div className="space-y-1.5 md:space-y-3 flex-1">
                {/* Titre réduit */}
                <h1 className="text-xl md:text-5xl font-black text-white italic tracking-tighter uppercase hover-glitch cursor-crosshair transition-all break-words">
                  {name || "ID Restreinte"}
                </h1>
                
                {/* Badges réduits */}
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                  <span className="bg-white/5 px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg border border-white/10 text-[8px] md:text-xs font-mono uppercase tracking-widest">
                    ID: {nni ? `CI-${nni}` : "ATTENTE"}
                  </span>
                  <span className="flex items-center gap-1 text-[8px] md:text-xs font-mono uppercase tracking-widest text-slate-500">
                    <MapPin size={10} className="text-orange-500" /> CI_Digital
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton QR réduit sur mobile */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto p-3 md:p-6 bg-orange-600 hover:bg-orange-500 text-white rounded-xl md:rounded-2xl shadow-lg md:shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center group active:scale-95"
            >
              <Zap size={20} className="group-hover:rotate-12 transition-transform md:w-8 md:h-8" />
              <span className="md:hidden ml-2 text-[10px] font-black uppercase tracking-widest">Scan QR</span>
            </button>
          </div>
        </div>

        {/* --- 2. STATS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <StatCardHUD icon={<Users />} label="Ménage" value="01" sub="Mb" color="orange" />
          <StatCardHUD icon={<Database />} label="Synchro" value="100%" sub="Val" color="emerald" />
          <StatCardHUD icon={<ShieldIcon />} label="Droits" value="ON" sub="SÉC" color="blue" />
          <StatCardHUD icon={<Brain />} label="Score" value="A+" sub="Opti" color="purple" />
        </div>

        {/* --- 3. ANALYTICS & LOGS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
          
          <div className="lg:col-span-8 space-y-5 md:space-y-8">
            <div className="glass-hud p-5 md:p-10 rounded-3xl md:rounded-[3rem] relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 md:mb-10">
                <h3 className="text-white font-black uppercase italic text-sm md:text-xl tracking-tighter">Répartition Foyer</h3>
                <Cpu size={18} className="text-orange-500 animate-spin md:w-6 md:h-6" style={{ animationDuration: '10s' }} />
              </div>
              <div className="space-y-5 md:space-y-8">
                <HUDProgressBar label={`${name?.split(' ')[0] || 'Citoyen'} (Chef)`} age="Vérifié" percent={100} color="orange" />
                <HUDProgressBar label="En attente" age="--" percent={0} color="slate" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-5 md:p-8 rounded-3xl md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden group cursor-pointer flex items-center justify-between">
               <div className="flex items-center gap-4 md:gap-6">
                 <Brain size={28} className="animate-pulse md:w-10 md:h-10" />
                 <div>
                   <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80">IA Insight</p>
                   <h4 className="text-sm md:text-xl font-black italic mt-0.5 md:mt-1">Dossier Souverain OK.</h4>
                 </div>
               </div>
               <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform md:w-7 md:h-7" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 md:space-y-8">
            <ProfilePhotoManager />

            <div className="bg-slate-900/80 border border-white/5 p-5 md:p-8 rounded-3xl md:rounded-[3rem] shadow-2xl">
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-orange-500 mb-5 md:mb-8 flex items-center gap-2">
                <Activity size={14} /> Flux Console _
              </h3>
              <div className="space-y-4 md:space-y-6">
                <LogItem title="Connexion Cloud" time="00:00" status="OK" />
                <LogItem title="Lecture NNI" time="00:01" status="SEC" />
                <LogItem title="Audit Identité" time="Live" status="CLN" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL QR --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { if(!scanSuccess) setIsModalOpen(false); }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateY: -45 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative w-full max-w-sm md:max-w-lg glass-hud rounded-3xl md:rounded-[3rem] border border-white/10 hologram-glow overflow-hidden"
            >
              <AnimatePresence>
                {scanSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                      <CheckCircle size={40} className="text-white md:w-[60px] md:h-[60px]" />
                    </motion.div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase italic">Authentifié</h2>
                    <p className="text-slate-500 font-mono text-[8px] md:text-[10px] mt-2 tracking-widest uppercase">ID Confirmée par Cloud CI</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 md:pb-6">
                   <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-lg p-0.5 flex items-center justify-center overflow-hidden border border-white/10">
                         {photoUrl ? (
                           <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-md" />
                         ) : (
                           <Fingerprint className="text-orange-500" size={20} />
                         )}
                      </div>
                      <span className="text-white font-black italic text-xs md:text-sm tracking-tight">{name?.split(' ')[0] || "CITOYEN"}_CORE</span>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="flex flex-col items-center gap-4 md:gap-6">
                   <div className="relative group cursor-pointer" onClick={handleScanSimulation}>
                      <div className="absolute -inset-4 bg-orange-500/20 rounded-2xl md:rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-2xl transition-transform active:scale-90">
                         <QrCode size={120} className="text-slate-950 md:w-[160px] md:h-[160px]" />
                         <div className="absolute inset-0 border-4 border-orange-500/50 rounded-2xl md:rounded-[2.5rem] animate-pulse pointer-events-none" />
                      </div>
                   </div>
                   <p className="text-[8px] md:text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] md:tracking-[0.4em] animate-pulse">Cliquer pour Simuler</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                   <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase">National ID</p>
                      <p className="text-[10px] md:text-xs font-bold text-white font-mono uppercase tracking-tighter">{nni ? `CI-${nni}` : "NON DEFINI"}</p>
                   </div>
                   <div className="p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                      <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase">Status</p>
                      <p className="text-[10px] md:text-xs font-bold text-emerald-500 font-mono uppercase">VÉRIFIÉ</p>
                   </div>
                </div>

                <button className="w-full py-4 md:py-5 bg-orange-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-lg active:scale-95">
                  <Download size={14} /> Exporter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCardHUD = ({ icon, label, value, sub, color }: any) => {
  const c: any = { 
    orange: "border-orange-500/30 text-orange-500 bg-orange-500/5 shadow-orange-500/10", 
    emerald: "border-emerald-500/30 text-emerald-500 bg-emerald-500/5 shadow-emerald-500/10", 
    blue: "border-blue-500/30 text-blue-500 bg-blue-500/5 shadow-blue-500/10", 
    purple: "border-purple-500/30 text-purple-500 bg-purple-500/5 shadow-purple-500/10" 
  };
  return (
    <div className={`p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border backdrop-blur-md transition-all hover:-translate-y-1 md:hover:-translate-y-2 group ${c[color]}`}>
      <div className="flex justify-between items-start mb-3 md:mb-6">
        <div className="p-2 md:p-3 bg-white/5 rounded-lg md:rounded-xl group-hover:rotate-12 transition-transform">
          {React.cloneElement(icon, { size: 18, className: "md:w-6 md:h-6" })}
        </div>
      </div>
      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60 mb-0.5 md:mb-1">{label}</p>
      <div className="flex items-baseline gap-1 md:gap-2">
        <p className="text-xl md:text-4xl font-black text-white italic tracking-tighter">{value}</p>
        <p className="text-[8px] md:text-[10px] font-bold uppercase text-slate-500">{sub}</p>
      </div>
    </div>
  );
};

const HUDProgressBar = ({ label, age, percent, color }: any) => {
  const bg: any = { orange: "bg-orange-500 shadow-[0_0_10px_#f97316]", blue: "bg-blue-500 shadow-[0_0_10px_#3b82f6]", emerald: "bg-emerald-500 shadow-[0_0_10px_#10b981]", slate: "bg-slate-700" };
  return (
    <div className="space-y-2 md:space-y-3 group">
      <div className="flex justify-between items-end">
        <p className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
          <span className={`w-1 h-2 md:h-3 ${bg[color].split(' ')[0]}`} /> {label}
        </p>
        <p className="text-[7px] md:text-[9px] font-mono text-slate-500 uppercase">{age} ● CERT</p>
      </div>
      <div className="w-full h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <div className={`h-full ${bg[color]} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const LogItem = ({ title, time, status }: any) => (
  <div className="flex items-center justify-between group p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-all border-l-2 border-transparent hover:border-orange-500">
    <div className="flex items-center gap-2 md:gap-4">
      <span className="text-[8px] md:text-[9px] font-mono text-slate-600">[{time}]</span>
      <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-wide group-hover:text-orange-500 transition-colors">{title}</p>
    </div>
    <span className="text-[7px] md:text-[8px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{status}</span>
  </div>
);

export default CitizenDashboard;