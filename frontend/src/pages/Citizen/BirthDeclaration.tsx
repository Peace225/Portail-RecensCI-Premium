// src/pages/citizen/BirthDeclaration.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Baby, Save, Fingerprint, Heart, User, 
  Camera, Briefcase, Info, ShieldCheck, 
  Cpu, Dna, Sparkles, Wand2, Phone, Calendar, 
  Target, Church, Hash
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---> IMPORT DU COMPOSANT D'UPLOAD <---
import DocumentUploadHUD from "../../components/DocumentUploadHUD";

const styles = `
  @keyframes scan-v { 0% { top: -100%; } 100% { top: 100%; } }
  .animate-scan-v { animation: scan-v 3s linear infinite; }
  .glass-hud {
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const BirthDeclaration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // ---> GESTION DES URLS D'IMAGES CLOUDINARY <---
  const [childPhotoUrl, setChildPhotoUrl] = useState<string>("");
  const [fatherPhotoUrl, setFatherPhotoUrl] = useState<string>("");
  const [motherPhotoUrl, setMotherPhotoUrl] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Test basique pour s'assurer que les photos sont uploadées
    if (!childPhotoUrl || !fatherPhotoUrl || !motherPhotoUrl) {
        toast.error("Veuillez fournir les 3 scans biométriques.");
        setLoading(false);
        return;
    }

    setTimeout(() => {
      toast.success("Dossier Biométrique Synchronisé 🧬");
      setLoading(false);
      // Ici, on enverra plus tard les données vers la BDD
      console.log("URLs sauvegardées :", { childPhotoUrl, fatherPhotoUrl, motherPhotoUrl });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans">
      <style>{styles}</style>
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(16,185,129,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* --- 1. HEADER HUD --- */}
        <div className="relative overflow-hidden bg-emerald-950/20 backdrop-blur-2xl p-10 rounded-[3.5rem] border-l-4 border-l-emerald-500 border border-white/5 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 shadow-lg">
              <Baby size={40} className="text-emerald-400 animate-pulse" />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Filiation <span className="text-emerald-500">Biométrique</span></h1>
              <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-[0.4em]">Node Protocol: BIRTH_DECLARATION_V4</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
          
          {/* --- SECTION 01 : L'ENFANT --- */}
          <section className="glass-hud p-8 md:p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-4 text-emerald-500 mb-10 border-b border-white/5 pb-6">
              <Baby size={20}/>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Profil du Nouveau-Né</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* REMPLACEMENT ICI */}
              <div className="lg:col-span-1">
                 <DocumentUploadHUD 
                   label="Scan Enfant" 
                   onUploadSuccess={setChildPhotoUrl} 
                 />
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputHUD label="Nom de famille" placeholder="KOUAME" />
                <InputHUD label="Prénoms" placeholder="MARC-AURÈLE" />
                <InputHUD label="Sexe" type="select" options={["Masculin", "Féminin"]} />
                <InputHUD label="Date de Naissance" type="date" icon={<Calendar size={14}/>} />
                <InputHUD label="Religion" type="select" options={["Christianisme", "Islam", "Animisme", "Autre"]} icon={<Church size={14}/>} />
                <InputHUD label="Contact d'Urgence" placeholder="+225 07..." icon={<Phone size={14}/>} />
              </div>
            </div>
          </section>

          {/* --- SECTION 02 : LES PARENTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ParentCard 
              role="Le Père" 
              color="blue" 
              icon={<User size={18}/>} 
              defaultName="Kevin Gael Kouhame" 
              onPhotoUpload={setFatherPhotoUrl} // Passer la fonction de MAJ
            />
            <ParentCard 
              role="La Mère" 
              color="pink" 
              icon={<Heart size={18}/>} 
              defaultName="Traoré Aminata" 
              onPhotoUpload={setMotherPhotoUrl} // Passer la fonction de MAJ
            />
          </div>

          {/* --- VALIDATION --- */}
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 max-w-2xl">
              <Info className="text-emerald-500 shrink-0" size={20} />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                La validation génère un certificat numérique provisoire crypté AES-512. Les scans biométriques sont requis.
              </p>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full max-w-md py-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.3)] transition-all uppercase tracking-[0.4em] text-[11px] flex flex-col items-center gap-2 active:scale-95 group"
            >
              {loading ? (
                <div className="flex items-center gap-3 animate-pulse"><Cpu className="animate-spin" size={20} /> <span>Séquençage...</span></div>
              ) : (
                <><div className="flex items-center gap-3"><Save size={20} /> <span>Certifier la Naissance</span></div></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const ParentCard = ({ role, color, icon, defaultName, onPhotoUpload }: any) => {
  return (
    <section className="glass-hud p-8 rounded-[3rem] border border-white/5 space-y-8 group transition-all hover:bg-white/5">
      <div className={`flex items-center justify-between border-b border-white/5 pb-6`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg text-white">{icon}</div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">{role}</h3>
        </div>
        {/* On gère la couleur d'animation en fonction du rôle */}
        <div className={`h-2 w-2 rounded-full animate-pulse ${color === 'blue' ? 'bg-blue-500' : 'bg-pink-500'}`} />
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        
        {/* REMPLACEMENT ICI */}
        <div className="w-full sm:w-1/3 shrink-0">
           <DocumentUploadHUD 
             label="Scan Parent" 
             onUploadSuccess={onPhotoUpload} 
           />
        </div>

        <div className="flex-1 space-y-4">
          <InputHUD label="Identité" placeholder={defaultName} dark />
          <InputHUD label="Profession" icon={<Briefcase size={12}/>} placeholder="Profession" dark />
          <div className="grid grid-cols-2 gap-4">
            <InputHUD label="Religion" type="select" options={["Christianisme", "Islam", "Autre"]} dark />
            <InputHUD label="Téléphone" icon={<Phone size={12}/>} placeholder="+225..." dark />
          </div>
          <InputHUD label="NNI Social" icon={<Hash size={12}/>} placeholder="CI-XXXXXXXX" dark />
        </div>
      </div>
    </section>
  );
};

const InputHUD = ({ label, type = "text", options, placeholder, dark, icon }: any) => (
  <div className="space-y-1 group w-full">
    <label className={`text-[8px] font-black uppercase tracking-widest ml-3 ${dark ? 'text-slate-600' : 'text-slate-500'}`}>{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
      {type === "select" ? (
        <select className={`w-full p-3.5 rounded-xl border outline-none focus:border-emerald-500 transition-all font-bold text-xs appearance-none ${dark ? 'bg-black/40 border-white/5 text-slate-300' : 'bg-white/5 border-white/10 text-white'}`}>
          {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input 
          type={type} placeholder={placeholder} 
          className={`w-full p-3.5 rounded-xl border outline-none focus:border-emerald-500 transition-all font-bold text-xs ${icon ? 'pl-10' : ''} ${dark ? 'bg-black/40 border-white/5 text-slate-300 placeholder:text-slate-800' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-700'}`} 
        />
      )}
    </div>
  </div>
);

export default BirthDeclaration;