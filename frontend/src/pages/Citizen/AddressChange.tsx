// src/pages/citizen/AddressChange.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, ArrowRight, Globe, ShieldCheck, 
  Navigation, Activity, Info, Cpu, LocateFixed, Compass 
} from "lucide-react";
import { toast } from "react-hot-toast";

const AddressChange = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [locationData, setLocationData] = useState({ city: "", district: "" });

  // SIMULATION DU SCAN GPS (SONAR)
  const handleGPSScan = () => {
    setIsScanning(true);
    toast.loading("Initialisation du sonar satellite...", { id: "gps-scan" });
    
    setTimeout(() => {
      setIsScanning(false);
      setLocationData({ city: "Abidjan", district: "Cocody" });
      toast.success("Position géo-spatiale verrouillée", { id: "gps-scan" });
    }, 3000);
  };

  const handleMigration = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Nœud de résidence mis à jour avec succès");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND HUD --- */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,130,0,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-l-4 border-orange-500 pl-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
            Migration <span className="text-orange-500">Interne</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">Protocole Géo-Spatiale v2.4</p>
            <div className={`h-2 w-2 rounded-full ${isScanning ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-hud p-8 md:p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
              
              <div className="space-y-8">
                {/* ADRESSE ACTUELLE */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                   <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Nœud Actuel</p>
                      <ShieldCheck size={14} className="text-emerald-500" />
                   </div>
                   <p className="font-bold text-white text-sm italic">Abidjan, Cocody, Riviera Palmerais, Rue Ministre</p>
                </div>

                {/* NOUVELLE ADRESSE + BOUTON GPS */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coordonnées de destination</p>
                     
                     {/* BOUTON SONAR GPS */}
                     <button 
                       onClick={handleGPSScan}
                       disabled={isScanning}
                       className="relative flex items-center gap-2 text-orange-500 hover:text-white transition-colors group"
                     >
                        <AnimatePresence>
                          {isScanning && (
                            <>
                              <motion.div initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 3, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-orange-500 rounded-full" />
                              <motion.div initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute inset-0 bg-orange-500 rounded-full" />
                            </>
                          )}
                        </AnimatePresence>
                        <LocateFixed size={16} className={`${isScanning ? 'animate-spin' : ''}`} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Détection Satellite</span>
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputHUD label="Nouvelle Ville" value={locationData.city} placeholder="En attente..." icon={<Globe size={16}/>} />
                    <InputHUD label="Nouveau Quartier" value={locationData.district} placeholder="En attente..." icon={<Navigation size={16}/>} />
                  </div>
                </div>

                <button 
                  onClick={handleMigration}
                  disabled={isSyncing}
                  className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all active:scale-95 disabled:bg-slate-800"
                >
                  {isSyncing ? (
                    <>
                      <Cpu size={18} className="animate-spin" />
                      <span>Synchronisation du nœud...</span>
                    </>
                  ) : (
                    <>
                      <span>Valider la Migration</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* CARTE HUD DYNAMIQUE */}
            <div className="glass-hud p-4 rounded-[2.5rem] h-64 relative overflow-hidden border border-white/5">
                <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center">
                    <div className="relative">
                      {/* CERCLES DE SCAN */}
                      <AnimatePresence>
                        {isScanning && (
                          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.5, opacity: 1 }} exit={{ opacity: 0 }} className="absolute -inset-10 border-2 border-orange-500/30 rounded-full animate-ping" />
                        )}
                      </AnimatePresence>
                      <Compass size={100} className={`text-orange-500/20 transition-all duration-1000 ${isScanning ? 'rotate-180 scale-125 opacity-40' : ''}`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <MapPin size={32} className={`${isScanning ? 'text-orange-500 animate-bounce' : 'text-slate-700'}`} />
                      </div>
                    </div>
                </div>
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
                   <p className="text-[8px] font-mono text-white">
                     {isScanning ? "POSITIONING_SYS: SEARCHING..." : "GPS_LOCK: Abidjan, CI"}
                   </p>
                </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-8 rounded-[2.5rem] space-y-4">
               <div className="flex items-center gap-3 text-blue-400">
                  <Activity size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Flux Démographique</h4>
               </div>
               <p className="text-[11px] leading-relaxed text-slate-400">
                  Ce changement d'adresse sera instantanément répercuté sur la carte de densité nationale pour optimiser les services publics.
               </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .glass-hud { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
};

const InputHUD = ({ label, placeholder, icon, value }: any) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4 group-focus-within:text-orange-500 transition-colors">
      {label}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500 transition-colors">{icon}</div>}
      <input 
        readOnly={!!value}
        value={value}
        placeholder={placeholder} 
        className={`w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-white font-bold text-sm transition-all placeholder:text-slate-800 ${icon ? 'pl-12' : ''}`} 
      />
    </div>
  </div>
);

export default AddressChange;