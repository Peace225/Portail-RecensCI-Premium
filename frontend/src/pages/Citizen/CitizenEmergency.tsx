// src/pages/citizen/CitizenEmergency.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, MapPin, Camera, Send, 
  ShieldAlert, Radio, Navigation, Info, 
  Activity, Cpu, Zap, Target, Crosshair
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiService";

const styles = `
  @keyframes ripple {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  .animate-ripple { animation: ripple 1.5s infinite; }
  
  .glass-emergency {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(220, 38, 38, 0.2);
    box-shadow: 0 0 40px rgba(220, 38, 38, 0.1);
  }

  .red-scan {
    background: linear-gradient(to bottom, transparent, rgba(220, 38, 38, 0.2), transparent);
    height: 100%;
    width: 100%;
    position: absolute;
    top: -100%;
    animation: scan-move 3s linear infinite;
  }
  @keyframes scan-move { 0% { top: -100%; } 100% { top: 100%; } }
`;

const CitizenEmergency: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [incidentType, setIncidentType] = useState<string | null>(null);

  const handleAlert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!incidentType) {
      toast.error("Veuillez définir la nature de l'urgence");
      return;
    }
    setLoading(true);

    const form = e.currentTarget;
    const textarea = form.querySelector<HTMLTextAreaElement>('textarea');
    const description = textarea?.value || '';

    const payload: any = {
      type: incidentType,
      description,
      location: 'Abidjan, CI',
      latitude: null as number | null,
      longitude: null as number | null,
    };

    const sendAlert = async (lat?: number, lng?: number) => {
      if (lat !== undefined) { payload.latitude = lat; payload.longitude = lng; }
      try {
        await apiService.post('/security/emergency', payload);
        toast.success("ALERTE CRITIQUE : REÇUE PAR LE NŒUD DE SÉCURITÉ", {
          duration: 5000,
          style: { 
            borderRadius: '20px', 
            background: '#450a0a', 
            color: '#fff', 
            border: '2px solid #ef4444',
            fontSize: '11px',
            fontWeight: '900'
          }
        });
      } catch {
        toast.error("Erreur lors de l'envoi de l'alerte.");
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => sendAlert(pos.coords.latitude, pos.coords.longitude),
        () => sendAlert()
      );
    } else {
      sendAlert();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans">
      <style>{styles}</style>
      
      {/* --- BACKGROUND LAYER : RADAR GRID --- */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(220,38,38,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* --- 1. HEADER HUD : EMERGENCY OVERRIDE --- */}
        <div className="relative group overflow-hidden bg-red-950/20 backdrop-blur-3xl p-10 rounded-[3.5rem] border-l-4 border-l-red-600 border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
             <Radio size={200} className="text-red-600 animate-pulse" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="relative">
                <div className="absolute inset-0 bg-red-600 rounded-full animate-ripple" />
                <div className="relative w-24 h-24 bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.5)]">
                  <ShieldAlert size={48} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-white">Signalement <span className="text-red-600">Flash</span></h2>
                <div className="flex items-center justify-center md:justify-start gap-4">
                    <p className="text-red-500 font-mono text-[10px] uppercase tracking-[0.4em]">Protocole d'Intervention d'État CI-911</p>
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleAlert} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* --- COLONNE GAUCHE : TYPE D'INCIDENT --- */}
          <div className="lg:col-span-7 space-y-6">
            <section className="glass-emergency p-8 md:p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden">
              <div className="red-scan opacity-20 pointer-events-none" />
              
              <div className="flex items-center gap-4 text-red-500 mb-4 border-b border-white/5 pb-6">
                <Target size={20}/>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Ciblage de la menace</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["Accident", "Incendie", "Agression", "Santé"].map((type) => (
                  <button 
                    key={type} type="button" onClick={() => setIncidentType(type)}
                    className={`group relative py-10 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 border-2 ${
                      incidentType === type 
                      ? 'bg-red-600 border-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] scale-95' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:border-red-500/30'
                    }`}
                  >
                    <div className={`absolute top-4 left-4 h-1.5 w-1.5 rounded-full ${incidentType === type ? 'bg-white animate-pulse' : 'bg-slate-800'}`} />
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Rapport de situation _</label>
                <textarea 
                  className="w-full p-8 bg-black/40 border border-white/10 rounded-[2.5rem] text-sm font-bold text-white focus:border-red-600 outline-none h-48 transition-all placeholder:text-slate-800 font-mono shadow-inner" 
                  placeholder="IDENTIFIER L'INCIDENT : LIEU, NOMBRE DE VICTIMES, RISQUES..." 
                />
              </div>
            </section>
          </div>

          {/* --- COLONNE DROITE : BIOMÉTRIE & PERIMETRE --- */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 border border-white/5 p-8 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
               <div className="flex items-center gap-4 text-slate-400">
                  <Navigation size={20} className="text-red-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Preuves & Géofencing</h3>
               </div>

               <div className="space-y-6">
                  <button type="button" className="w-full py-6 bg-red-600/10 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all group">
                     <Camera size={20} className="group-hover:rotate-12 transition-transform" /> Capturer Flux Visuel
                  </button>

                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex items-center gap-5">
                     <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                        <div className="relative w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500"><Crosshair size={20}/></div>
                     </div>
                     <div className="flex-1">
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Satellite Lock</p>
                        <p className="text-sm font-black text-white italic">PRECISION: 0.8m</p>
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-red-600/10 rounded-[2rem] border border-red-500/20 flex gap-4">
                  <Info size={20} className="text-red-500 shrink-0" />
                  <p className="text-[9px] text-red-300 leading-relaxed font-bold uppercase tracking-wider">
                     Avertissement : L'IA Souveraine authentifie votre position via les antennes relais. Tout abus est tracé.
                  </p>
               </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full py-10 rounded-[3rem] font-black flex flex-col items-center justify-center gap-2 uppercase tracking-[0.4em] text-xs transition-all duration-500 ${
                loading 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_20px_60px_rgba(220,38,38,0.4)] active:scale-95 group border border-red-400/30'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-4 animate-pulse">
                  <Cpu className="animate-spin" size={24} /> 
                  <span>TRANS_EN_COURS...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Zap size={24} className="group-hover:scale-125 transition-transform" />
                    <span>Lancer le SOS Prioritaire</span>
                  </div>
                  <span className="text-[8px] opacity-60 font-mono tracking-widest uppercase">Encryption Souveraine CI-SECURE</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitizenEmergency;