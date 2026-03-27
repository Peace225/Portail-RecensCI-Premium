// src/pages/citizen/DeathDeclaration.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Skull, Save, Fingerprint, UserX, 
  FileText, ShieldAlert, Cpu, Clock, MapPin, 
  Church, Briefcase, Phone,
  Users, Scale, Activity
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---> IMPORT DU COMPOSANT D'UPLOAD CLOUDINARY <---
import DocumentUploadHUD from "../../components/DocumentUploadHUD";

const styles = `
  @keyframes scan-red { 0% { top: -100%; } 100% { top: 100%; } }
  .animate-scan-red { animation: scan-red 3s linear infinite; }
  .glass-hud {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const DeathDeclaration: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // ---> ETATS POUR CLOUDINARY <---
  const [deceasedPhotoUrl, setDeceasedPhotoUrl] = useState<string>("");
  const [cmdDocUrl, setCmdDocUrl] = useState<string>("");

  // SIMULATION DE DÉTECTION DES HÉRITIERS
  const heirs = [
    { name: "Traoré Aminata", relation: "Conjointe", priority: "Priorité 1", amount: "250.000 CFA/mois" },
    { name: "Kouhame Axel", relation: "Enfant (Mineur)", priority: "Priorité 2", amount: "87.500 CFA/mois" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Vérification des documents requis
    if (!deceasedPhotoUrl || !cmdDocUrl) {
      toast.error("Le scan biométrique et le Certificat Médical sont requis.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      toast.success("Dossier de succession initialisé.", {
        style: { borderRadius: '20px', background: '#450a0a', color: '#fff', border: '1px solid #dc2626' }
      });
      setLoading(false);
      console.log("Documents Cloudinary :", { deceasedPhotoUrl, cmdDocUrl });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans">
      <style>{styles}</style>
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(220,38,38,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* --- 1. HEADER HUD --- */}
        <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-2xl p-10 rounded-[3.5rem] border-l-4 border-l-red-600 border border-white/5 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-red-950/20 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-lg">
              <UserX size={48} className="text-red-500" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                Registre de <span className="text-red-600">Décès</span>
              </h1>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">Node Protocol: SUCCESSION_INIT_V4</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
          
          {/* --- SECTION 01 : IDENTITÉ DU DÉFUNT --- */}
          <section className="glass-hud p-8 md:p-12 rounded-[3.5rem] space-y-10 relative overflow-hidden">
            <div className="flex items-center gap-4 text-red-500 mb-6 border-b border-white/5 pb-6">
              <Skull size={20}/>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Identification du Défunt</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* ---> REMPLACEMENT UPLOAD PHOTO DÉFUNT <--- */}
              <div className="lg:col-span-1">
                 <DocumentUploadHUD 
                   label="Photo d'identification" 
                   onUploadSuccess={setDeceasedPhotoUrl} 
                 />
              </div>
              
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputHUD label="Nom de famille" placeholder="KOUAME" />
                <InputHUD label="Prénoms" placeholder="JEAN-BAPTISTE" />
                <div className="grid grid-cols-2 gap-4">
                    <InputHUD label="Âge" type="number" placeholder="00" />
                    <InputHUD label="Religion" type="select" options={["Christianisme", "Islam", "Autre"]} icon={<Church size={14}/>} />
                </div>
                <InputHUD label="NNI Social" placeholder="CI-XXXXXXXX" icon={<Fingerprint size={14}/>} />
                <InputHUD label="Profession" placeholder="EX: RETRAITÉ" icon={<Briefcase size={14}/>} />
                <InputHUD label="Contact Proche" placeholder="+225..." icon={<Phone size={14}/>} />
              </div>
            </div>
          </section>

          {/* --- SECTION 02 : CONSTAT & PREUVES --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="glass-hud p-8 rounded-[3rem] space-y-8">
                <div className="flex items-center gap-3 text-red-500">
                    <Clock size={20}/>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">Constat Temporel</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InputHUD label="Date" type="date" />
                    <InputHUD label="Heure" type="time" />
                </div>
                <InputHUD label="Lieu du décès" placeholder="VILLE / HÔPITAL" icon={<MapPin size={14}/>} />
            </section>

            {/* ---> REMPLACEMENT UPLOAD CERTIFICAT MÉDICAL <--- */}
            <section className="bg-red-600/5 border border-red-500/20 p-8 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-red-500"><FileText size={32} /></div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase italic">Certificat Médical</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">CMD Obligatoire pour clôture</p>
                </div>
                
                <div className="w-full max-w-sm">
                   <DocumentUploadHUD 
                     label="Téléverser le CMD (PDF/Image)" 
                     onUploadSuccess={setCmdDocUrl} 
                   />
                </div>
            </section>
          </div>

          {/* --- SECTION 03 : AYANTS-DROITS DÉTECTÉS --- */}
          <section className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Scale size={150} /></div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 relative z-10">
                <div className="flex items-center gap-4 text-blue-500">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg"><Users size={28} className="text-white" /></div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tighter italic">Héritiers & Ayants-Droits</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">Détection IA basée sur le Ménage</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                   <Activity size={14} className="text-emerald-500 animate-pulse" />
                   <span className="text-[9px] font-black text-emerald-500 uppercase">Calcul des droits actif</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {heirs.map((heir, idx) => (
                  <div key={idx} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 hover:bg-white/10 transition-all group">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <h4 className="text-lg font-black text-white italic">{heir.name}</h4>
                           <p className="text-[10px] text-slate-500 uppercase font-bold">{heir.relation}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-lg tracking-widest">{heir.priority}</span>
                     </div>
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Estimation Pension de Réversion</p>
                        <p className="text-xl font-black text-emerald-500">{heir.amount}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* --- VALIDATION --- */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 bg-red-600/5 p-8 rounded-[2.5rem] border border-red-500/10 max-w-3xl">
              <ShieldAlert className="text-red-500 shrink-0" size={24} />
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider italic">
                La clôture du nœud citoyen est une action irréversible. L'IA de RecensCI notifiera automatiquement les institutions de prévoyance sociale.
              </p>
            </div>
            
            <button 
              disabled={loading}
              className="w-full max-w-md py-10 bg-slate-900 hover:bg-red-900 text-white font-black rounded-[3rem] shadow-[0_0_50px_rgba(220,38,38,0.2)] transition-all duration-500 uppercase tracking-[0.4em] text-[11px] flex flex-col items-center gap-3 active:scale-95 group border border-white/10"
            >
              {loading ? (
                <div className="flex items-center gap-4 animate-pulse"><Cpu className="animate-spin" size={24} /> <span>Calcul de Succession...</span></div>
              ) : (
                <><div className="flex items-center gap-4"><Save size={24} /> <span>Clôturer & Notifier les Ayants-Droits</span></div></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- HELPERS ---

const InputHUD = ({ label, type = "text", options, placeholder, icon }: any) => (
  <div className="space-y-1.5 group w-full">
    <label className="text-[8px] font-black uppercase tracking-widest ml-3 text-slate-600 group-focus-within:text-red-500 transition-colors">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">{icon}</div>}
      {type === "select" ? (
        <select className="w-full p-3.5 rounded-xl border border-white/10 outline-none focus:border-red-600 transition-all font-bold text-xs appearance-none bg-black/40 text-white">
          {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} className={`w-full p-3.5 rounded-xl border border-white/10 outline-none focus:border-red-600 transition-all font-bold text-xs bg-black/40 text-white placeholder:text-slate-800 ${icon ? 'pl-11' : ''}`} />
      )}
    </div>
  </div>
);

export default DeathDeclaration;