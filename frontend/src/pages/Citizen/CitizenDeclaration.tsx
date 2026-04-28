// src/pages/citizen/StatusDeclaration.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, HeartOff, Save, Fingerprint, User, 
  Briefcase, Info, ShieldCheck, 
  Cpu, Sparkles, Calendar, MapPin,
  Search, Link as LinkIcon, Scale, Landmark, 
  Hash, UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiService";

// ---> IMPORT DU COMPOSANT D'UPLOAD CLOUDINARY <---
import DocumentUploadHUD from "../../components/DocumentUploadHUD";

const styles = `
  @keyframes scan-v { 0% { top: -100%; } 100% { top: 100%; } }
  .animate-scan-v { animation: scan-v 3s linear infinite; }
  .glass-hud {
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.3); border-radius: 10px; }
`;

const REGIME_INFO: Record<string, string> = {
  "Communauté de biens": "Analyse IA : Partage intégral du patrimoine acquis. Recommandé pour la solidarité familiale maximale.",
  "Séparation de biens": "Analyse IA : Autonomie financière totale. Idéal pour les conjoints exerçant des professions libérales ou commerciales.",
  "Participation aux acquêts": "Analyse IA : Hybride. Séparation pendant l'union, mais partage de la valeur créée à la dissolution."
};

const StatusDeclaration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState<"MARRIAGE" | "DIVORCE">("MARRIAGE");
  const [regime, setRegime] = useState("Communauté de biens");

  // ---> GESTION DES FICHIERS CLOUDINARY <---
  const [partnerPhotoUrl, setPartnerPhotoUrl] = useState<string>("");
  const [divorceDocUrl, setDivorceDocUrl] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (eventType === "MARRIAGE" && !partnerPhotoUrl) {
      toast.error("Le scan biométrique du conjoint est requis.");
      setLoading(false);
      return;
    }
    if (eventType === "DIVORCE" && !divorceDocUrl) {
      toast.error("Le scan du jugement de divorce est requis.");
      setLoading(false);
      return;
    }

    try {
      if (eventType === "MARRIAGE") {
        await apiService.post('/events/marriage', {
          spouse1Name: '',
          spouse2Name: '',
          marriageDate: new Date().toISOString(),
          partnerPhotoUrl,
          regime,
        });
        toast.success("Union civile synchronisée");
      } else {
        await apiService.post('/events/divorce', {
          spouse1Name: '',
          spouse2Name: '',
          divorceDate: new Date().toISOString(),
          judgmentDocUrl: divorceDocUrl,
        });
        toast.success("Dissociation enregistrée");
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans selection:bg-pink-500/30">
      <style>{styles}</style>
      
      {/* --- BACKGROUND HUD --- */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(236,72,153,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* --- 1. HEADER DYNAMIQUE --- */}
        <div className="relative overflow-hidden bg-pink-950/10 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border-l-4 border-l-pink-500 border border-white/5 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center border border-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.2)] shrink-0">
                {eventType === "MARRIAGE" ? <Heart size={40} className="text-pink-400 animate-pulse" /> : <HeartOff size={40} className="text-slate-500" />}
                </div>
                <div className="text-center md:text-left space-y-1">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                    Statut <span className="text-pink-500">Civil</span>
                </h1>
                <p className="text-pink-500/60 font-mono text-[9px] uppercase tracking-[0.4em]">Node Protocol: CIVIL_RECORD_V4.2</p>
                </div>
            </div>

            {/* SWITCHER EVENT */}
            <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                <button type="button" onClick={() => setEventType("MARRIAGE")} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${eventType === "MARRIAGE" ? "bg-pink-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Mariage</button>
                <button type="button" onClick={() => setEventType("DIVORCE")} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${eventType === "DIVORCE" ? "bg-slate-700 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}>Divorce</button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
          <AnimatePresence mode="wait">
            {eventType === "MARRIAGE" ? (
              <motion.div key="marriage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                
                {/* --- SECTION CONJOINT(E) --- */}
                <section className="glass-hud p-8 md:p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-4 text-pink-500 mb-10 border-b border-white/5 pb-6">
                    <UserCheck size={20}/>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Identité du futur conjoint</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* ---> INTEGRATION CLOUDINARY <--- */}
                    <div className="lg:col-span-1">
                       <DocumentUploadHUD 
                         label="Scan Biométrique" 
                         onUploadSuccess={setPartnerPhotoUrl} 
                       />
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <InputHUD label="Nom de famille" placeholder="NOM DE NAISSANCE" />
                      <InputHUD label="Prénoms" placeholder="PRÉNOMS COMPLETS" />
                      <div className="grid grid-cols-2 gap-4">
                        <InputHUD label="Âge" type="number" placeholder="00" />
                        <InputHUD label="NNI / Matricule Social" icon={<Hash size={14}/>} placeholder="CI-XXXXXXXX" />
                      </div>
                      <InputHUD label="Profession Actuelle" icon={<Briefcase size={14}/>} placeholder="EX: ARCHITECTE" />
                      <InputHUD label="Date de l'Union" type="date" icon={<Calendar size={14}/>} />
                      <InputHUD label="Lieu de Célébration" placeholder="MAIRIE / VILLE" icon={<MapPin size={14}/>} />
                    </div>
                  </div>
                </section>

                {/* --- MODULE PATRIMOINE IA --- */}
                <section className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative">
                   <div className="flex items-center gap-4 text-blue-500 mb-6 border-b border-white/5 pb-6">
                      <Scale size={20}/>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Régime Matrimonial IA</h3>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <InputHUD 
                           label="Type de Régime" 
                           type="select" 
                           options={Object.keys(REGIME_INFO)} 
                           onChange={(e: any) => setRegime(e.target.value)}
                         />
                         <div className="p-5 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                            <Landmark size={20} className="text-slate-600" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                               Ce choix définit les droits de succession <br /> et la protection du foyer.
                            </p>
                         </div>
                      </div>

                      <motion.div 
                        key={regime} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] space-y-4 relative overflow-hidden"
                      >
                         <div className="flex items-center gap-3 text-blue-400">
                            <Sparkles size={18} className="animate-pulse" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Legal_Insight_IA</h4>
                         </div>
                         <p className="text-xs text-white leading-relaxed font-medium italic">
                            "{REGIME_INFO[regime]}"
                         </p>
                         <div className="absolute bottom-0 right-0 p-4 opacity-5"><Scale size={60} /></div>
                      </motion.div>
                   </div>
                </section>
              </motion.div>
            ) : (
              /* --- SECTION DIVORCE --- */
              <motion.div key="divorce" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="glass-hud p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10">
                <div className="flex items-center gap-4 text-slate-500 mb-6 border-b border-white/5 pb-6">
                    <HeartOff size={20}/>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Dissolution de Nœud Civil</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputHUD label="NNI du conjoint à dissocier" placeholder="CI-XXXXXXXX" icon={<Search size={14}/>} />
                    <InputHUD label="Date du jugement" type="date" icon={<Calendar size={14}/>} />
                    <InputHUD label="Référence Judiciaire" placeholder="N° ACTE / JUGEMENT" icon={<LinkIcon size={14}/>} />
                    
                    <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-start gap-4">
                        <Info className="text-red-400 shrink-0" size={18} />
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">La désynchronisation des prestations sociales est irréversible après validation.</p>
                    </div>
                </div>

                {/* ---> INTEGRATION CLOUDINARY POUR LE JUGEMENT DE DIVORCE <--- */}
                <div className="pt-6 border-t border-white/5">
                   <DocumentUploadHUD 
                     label="Scan du Jugement (PDF ou Image)" 
                     onUploadSuccess={setDivorceDocUrl} 
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VALIDATION */}
          <div className="flex flex-col items-center gap-8">
            <button 
                type="submit"
                disabled={loading} 
                className={`w-full max-w-md py-10 ${eventType === "MARRIAGE" ? 'bg-pink-600 hover:bg-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.3)]' : 'bg-slate-700 hover:bg-slate-600'} text-white font-black rounded-[3rem] transition-all duration-500 uppercase tracking-[0.4em] text-[10px] flex flex-col items-center gap-2 active:scale-95 group border border-white/10`}
            >
              {loading ? (
                <div className="flex items-center gap-3 animate-pulse"><Cpu className="animate-spin" size={24} /> <span>Calcul de Filiation...</span></div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Save size={20} className="group-hover:scale-125 transition-transform" /> 
                    <span>Certifier l'Acte d'État Civil</span>
                  </div>
                  <span className="text-[8px] opacity-40 font-mono tracking-widest uppercase italic">Secure_Hash: {Math.random().toString(16).substring(7).toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANT INPUT HUD UNIFIÉ ---
const InputHUD = ({ label, type = "text", options, placeholder, icon, onChange }: any) => (
  <div className="space-y-1 group w-full">
    <label className="text-[8px] font-black uppercase tracking-widest ml-3 text-slate-600 group-focus-within:text-pink-500 transition-colors">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-pink-500 transition-colors">{icon}</div>}
      {type === "select" ? (
        <select onChange={onChange} className="w-full p-3.5 rounded-xl border border-white/10 outline-none focus:border-pink-500 transition-all font-bold text-xs appearance-none bg-black/40 text-white">
          {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} className={`w-full p-3.5 rounded-xl border border-white/10 outline-none focus:border-pink-500 transition-all font-bold text-xs bg-black/40 text-white placeholder:text-slate-800 ${icon ? 'pl-11' : ''}`} />
      )}
    </div>
  </div>
);

export default StatusDeclaration;