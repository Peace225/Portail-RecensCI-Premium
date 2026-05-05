import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, MapPin, Camera, Send, 
  ShieldAlert, Radio, Navigation, Info, 
  Activity, Cpu, Zap, Target, Crosshair, CheckCircle2, Trash2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { supabase } from "../../supabaseClient";
import DocumentUploadHUD from "../../components/DocumentUploadHUD";

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
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const { id, name } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const handleAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentType) {
      toast.error("IDENTIFIEZ LA MENACE");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("CRYPTAGE SOS...");

    try {
      const { error } = await supabase
        .from('requests') 
        .insert([{
          citizen_id: id,
          type: 'EMERGENCY',
          category: incidentType,
          description: description,
          status: 'PENDING',
          evidence_url: evidenceUrl,
          metadata: { location, citizen_name: name, priority: 'CRITICAL' }
        }]);

      if (error) throw error;

      toast.success("ALERTE TRANSMISE", {
        id: loadingToast,
        style: { borderRadius: '15px', background: '#450a0a', color: '#fff', fontSize: '9px', fontWeight: '900' }
      });

      setIncidentType(null);
      setDescription("");
      setEvidenceUrl(null);

    } catch (err: any) {
      toast.error("ÉCHEC : " + err.message, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-16 md:pt-24 relative overflow-hidden font-sans">
      <style>{styles}</style>
      
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(220,38,38,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-5 md:space-y-10 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="relative group overflow-hidden bg-red-950/20 backdrop-blur-3xl p-5 md:p-10 rounded-[1.5rem] md:rounded-[3.5rem] border-l-4 border-l-red-600 border border-white/5 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 rounded-full animate-ripple" />
              <div className="relative w-14 h-14 md:w-24 md:h-24 bg-red-600 text-white rounded-xl md:rounded-3xl flex items-center justify-center">
                <ShieldAlert size={28} className="md:w-12 md:h-12" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl md:text-4xl font-black tracking-tighter uppercase italic text-white">Signalement <span className="text-red-600">Flash</span></h2>
              <p className="text-red-500 font-mono text-[7px] md:text-[9px] uppercase tracking-[0.3em]">Protocole CI-911 Secure</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAlert} className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 pb-10">
          
          <div className="lg:col-span-7 space-y-5">
            <section className="glass-emergency p-5 md:p-12 rounded-[1.5rem] md:rounded-[3.5rem] space-y-5 md:space-y-10 relative overflow-hidden">
              <div className="red-scan opacity-20 pointer-events-none" />
              
              <div className="flex items-center gap-3 text-red-500 border-b border-white/5 pb-3">
                <Target size={16}/>
                <h3 className="text-[9px] md:text-xs font-black uppercase tracking-widest text-white">Ciblage menace</h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {["Accident", "Incendie", "Agression", "Santé"].map((type) => (
                  <button 
                    key={type} type="button" onClick={() => setIncidentType(type)}
                    className={`group relative py-5 md:py-10 rounded-xl md:rounded-3xl font-black uppercase tracking-widest text-[8px] md:text-[10px] transition-all border-2 ${
                      incidentType === type 
                      ? 'bg-red-600 border-red-500 text-white shadow-lg scale-95' 
                      : 'bg-white/5 border-white/5 text-slate-500 hover:border-red-500/30'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Rapport d'incident _</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 md:p-8 bg-black/40 border border-white/10 rounded-xl md:rounded-[2.5rem] text-[11px] md:text-sm font-bold text-white focus:border-red-600 outline-none h-28 md:h-48 transition-all placeholder:text-slate-800 font-mono" 
                  placeholder="DÉTAILS CRITIQUES..." 
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 border border-white/5 p-5 md:p-8 rounded-[1.5rem] md:rounded-[3.5rem] shadow-2xl space-y-6 md:space-y-10">
               <div className="flex items-center gap-3 text-slate-400">
                  <Navigation size={16} className="text-red-600" />
                  <h3 className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Preuves & Géo</h3>
               </div>

               <div className="space-y-4">
                  {evidenceUrl ? (
                    <div className="relative group rounded-lg overflow-hidden border border-red-500/50 h-28 md:h-40">
                      <img src={evidenceUrl} alt="Evidence" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => setEvidenceUrl(null)} className="p-2 bg-red-600 text-white rounded-full"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ) : (
                    <DocumentUploadHUD 
                      label="Scanner Scene"
                      onUploadSuccess={(url) => setEvidenceUrl(url)}
                    />
                  )}

                  <div className="p-3 md:p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-xl md:rounded-[2rem] flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-500">
                        <Crosshair size={16}/>
                      </div>
                      <div className="flex-1">
                        <p className="text-[7px] md:text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Satellite Lock</p>
                        <p className="text-[10px] md:text-xs font-black text-white italic">
                          {location ? `${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}` : "ACQUISITION..."}
                        </p>
                      </div>
                  </div>
               </div>

               <div className="p-3 bg-red-600/5 rounded-lg border border-red-500/10 flex gap-2">
                  <Info size={14} className="text-red-500 shrink-0" />
                  <p className="text-[7px] text-red-300 font-bold uppercase leading-tight">
                      Géolocalisation d'État active.
                  </p>
               </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className={`w-full py-5 md:py-10 rounded-2xl md:rounded-[3rem] font-black flex flex-col items-center justify-center gap-1 uppercase tracking-widest text-[9px] md:text-xs transition-all ${
                loading 
                ? 'bg-slate-800 text-slate-600' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-xl active:scale-95 group'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2 animate-pulse">
                  <Cpu className="animate-spin" size={16} /> <span>TRANSMISSION...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Zap size={18} />
                    <span>Lancer SOS</span>
                  </div>
                  <span className="text-[6px] md:text-[7px] opacity-60 font-mono tracking-widest uppercase">Encryption CI-Sovereign</span>
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