import React, { useState } from "react";
import { 
  AlertTriangle, MapPin, Camera, Send, 
  ShieldAlert, Radio, Navigation, Info 
} from "lucide-react";
import { toast } from "react-hot-toast";

const CitizenEmergency: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [incidentType, setIncidentType] = useState<string | null>(null);

  const handleAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType) {
      toast.error("Veuillez sélectionner un type d'incident");
      return;
    }
    setLoading(true);
    
    // Simulation d'envoi satellite / réseau d'État
    setTimeout(() => {
      toast.success("ALERTE CRITIQUE TRANSMISE", {
        duration: 6000,
        icon: '🚨',
        style: { 
          borderRadius: '30px', 
          background: '#ef4444', 
          color: '#fff', 
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          border: '4px solid #fca5a5'
        }
      });
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in zoom-in-95 duration-700">
      
      {/* --- BANNER D'URGENCE STYLE "COMMAND CENTER" --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-900 p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-red-500/30 text-white border-b-8 border-red-950">
        <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse">
           <Radio size={180} />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
            <ShieldAlert size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Signalement d'Urgence</h2>
            <p className="text-red-100 font-bold text-[10px] tracking-[0.4em] uppercase opacity-80">
              Protocole de réponse prioritaire • État de Côte d'Ivoire
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAlert} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* --- COLONNE SÉLECTION TYPE --- */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center gap-3 ml-2">
               <AlertTriangle className="text-red-600" size={20} />
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Nature de l'urgence</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["Accident", "Incendie", "Agression", "Santé"].map((type) => (
                <button 
                  key={type} 
                  type="button" 
                  onClick={() => setIncidentType(type)}
                  className={`group relative py-8 rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all duration-300 border-2 ${
                    incidentType === type 
                    ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-200 scale-95' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  {type}
                  {incidentType === type && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full animate-ping"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Description des faits</label>
              <textarea 
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[2.5rem] text-sm font-bold focus:bg-white focus:border-red-500 focus:ring-0 outline-none h-40 transition-all placeholder:text-slate-300" 
                placeholder="Ex: Collision entre deux véhicules au carrefour Saint-Jean..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* --- COLONNE BIOMÉTRIE & LOC --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl space-y-8">
             <div className="flex items-center gap-3">
                <Navigation className="text-red-500" size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preuves & Localisation</h3>
             </div>

             <div className="space-y-4">
                <button type="button" className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-slate-900 transition-all group">
                   <Camera size={20} className="group-hover:scale-110 transition-transform" /> Capturer Photo / Vidéo
                </button>
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-emerald-500 uppercase">GPS Activé</p>
                      <p className="text-[11px] font-bold text-white">Précision : 2.5 mètres</p>
                   </div>
                </div>
             </div>

             <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20 flex gap-3">
                <Info size={18} className="text-red-500 shrink-0" />
                <p className="text-[9px] text-red-200 leading-relaxed font-medium">
                   Toute fausse alerte volontaire est passible de poursuites judiciaires conformément à la loi pénale.
                </p>
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-8 rounded-[3rem] font-black flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs transition-all duration-500 ${
              loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-2xl shadow-red-500/40 hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-3"><Radio className="animate-spin" /> Transmission en cours...</span>
            ) : (
              <><Send size={20} /> Déclencher l'alerte</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CitizenEmergency;