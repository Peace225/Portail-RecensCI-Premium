import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Home, Zap, Save, UserCheck, 
  PlusCircle, Trash2, Fingerprint, Cpu, ShieldCheck,
  Activity, Wifi, Stethoscope, Utensils, Droplets, Phone
} from "lucide-react";
import { toast } from "react-hot-toast";

// ---> IMPORT DU COMPOSANT D'UPLOAD CLOUDINARY <---
import DocumentUploadHUD from "../../components/DocumentUploadHUD";

interface FamilyMember {
  id: number;
  lastName: string;
  firstName: string;
  age: string;
  religion: string;
  profession: string;
  relation: string;
  nni: string;
  photoUrl?: string;
}

const CensusDetails = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declarantPhotoUrl, setDeclarantPhotoUrl] = useState<string>("");

  const stats = useMemo(() => ({ total: members.length + 1 }), [members]);

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now(), lastName: "", firstName: "", age: "", religion: "Christianisme", profession: "", relation: "Enfant", nni: "", photoUrl: ""
    };
    setMembers([...members, newMember]);
    toast.success("Nouveau profil rattaché au nœud familial", { style: { fontSize: '10px' } });
  };

  const removeMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
    toast.error("Unité retirée du registre", { style: { fontSize: '10px' } });
  };

  const updateMemberPhoto = (id: number, url: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, photoUrl: url } : m));
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    if (!declarantPhotoUrl) {
      toast.error("La photo du Chef de Ménage est requise.", { style: { fontSize: '10px' } });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Données transmises au Cloud Souverain 🇨🇮", { style: { fontSize: '10px' } });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-20 md:pt-24 relative overflow-hidden font-sans selection:bg-orange-500/30">
      
      <style>{`
        @keyframes scan { 0% { top: -100%; opacity: 0; } 50% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 130, 0, 0.3); border-radius: 10px; }
        .glass-hud { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      {/* --- WIDGET ANALYSE LIVE (Desktop uniquement) --- */}
      <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="fixed bottom-10 right-10 z-[100] hidden lg:block pointer-events-none">
        <div className="glass-hud p-5 rounded-[2rem] border border-orange-500/30 w-56 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Calculateur IA</span>
            <Activity size={12} className="text-orange-500 animate-pulse" />
          </div>
          <p className="text-[9px] text-slate-500 uppercase font-bold">Membres Détectés</p>
          <p className="text-3xl font-black text-white italic">0{stats.total}</p>
          <div className="h-px w-full bg-white/10 my-3" />
          <p className="text-[7px] text-slate-600 font-mono leading-tight">STATUS: SCANNING_LIFE_SIGNS...</p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col gap-2 md:gap-4 border-l-4 border-orange-500 pl-4 md:pl-8">
          <h1 className="text-2xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
            Recensement <span className="text-orange-500">National</span>
          </h1>
          <p className="text-slate-500 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">Node ID: CI-RE-2026-X</p>
        </div>

        <form className="space-y-6 md:space-y-10 pb-20 md:pb-32" onSubmit={(e) => e.preventDefault()}>
          
          {/* 1. CHEF DE MÉNAGE (DÉCLARANT) */}
          <section className="glass-hud p-5 md:p-10 rounded-3xl md:rounded-[3.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6 mb-6 md:mb-8">
              <div className="flex items-center gap-3 text-orange-500">
                <UserCheck size={20} className="md:w-6 md:h-6" />
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Chef de Ménage</h3>
              </div>
              <ShieldCheck className="text-emerald-500 w-5 h-5 md:w-6 md:h-6" />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
               {/* INTEGRATION CLOUDINARY */}
               <div className="w-full lg:w-56 shrink-0">
                 <DocumentUploadHUD 
                   label="Scan Biométrique" 
                   onUploadSuccess={setDeclarantPhotoUrl} 
                 />
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-5">
                  <InputHUD label="Nom de famille" placeholder="KOUAME" />
                  <InputHUD label="Prénoms" placeholder="JEAN MARC" />
                  <InputHUD label="Téléphone" icon={<Phone size={14}/>} placeholder="07 00 00 00 00" />
                  <InputHUD label="NNI / Sécurité Sociale" icon={<Fingerprint size={14}/>} placeholder="CI-0102938475" />
                  <InputHUD label="Religion" type="select" options={["Christianisme", "Islam", "Animisme", "Autre"]} />
                  <InputHUD label="Profession" placeholder="EX: ARCHITECTE" />
               </div>
            </div>
          </section>

          {/* 2. ACCÈS AUX SERVICES & NIVEAU DE VIE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            <div className="glass-hud p-5 md:p-8 rounded-3xl md:rounded-[3rem] space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-3 text-orange-500 mb-2 md:mb-4">
                <Home size={16} className="md:w-5 md:h-5" />
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">Habitat & Base</h3>
              </div>
              <InputHUD label="Type de Logement" type="select" options={["Villa", "Appartement", "Habitat Traditionnel"]} />
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <InputHUD label="Électricité" icon={<Zap size={14}/>} type="select" options={["CIE", "Solaire", "Aucun"]} />
                <InputHUD label="Eau" icon={<Droplets size={14}/>} type="select" options={["SODECI", "Forage", "Puits"]} />
              </div>
            </div>

            <div className="glass-hud p-5 md:p-8 rounded-3xl md:rounded-[3rem] space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-3 text-blue-500 mb-2 md:mb-4">
                <Activity size={16} className="md:w-5 md:h-5" />
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">Numérique & Santé</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <InputHUD label="Internet" icon={<Wifi size={14}/>} type="select" options={["Fibre/ADSL", "4G/5G", "Aucun"]} />
                <InputHUD label="Soins" icon={<Stethoscope size={14}/>} type="select" options={["Assurance/CMU", "Privé", "Aucun"]} />
              </div>
              <InputHUD label="Repas / jour" icon={<Utensils size={14}/>} type="select" options={["1 repas", "2 repas", "3 repas", "Plus de 3"]} />
            </div>
          </div>

          {/* 3. MEMBRES RATTACHÉS */}
          <section className="bg-slate-900/50 border border-orange-500/10 p-5 md:p-10 rounded-3xl md:rounded-[3.5rem] space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border-b border-white/5 pb-4 md:pb-6 text-white">
              <div className="flex items-center gap-3">
                <div className="p-3 md:p-4 bg-orange-600 rounded-xl md:rounded-2xl shadow-lg"><Users size={20} className="md:w-6 md:h-6" /></div>
                <h3 className="text-sm md:text-lg font-black uppercase tracking-tighter italic">Composition Foyer</h3>
              </div>
              <button 
                type="button" onClick={addMember}
                className="px-5 py-3 md:px-6 md:py-4 bg-white text-slate-900 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl"
              >
                <PlusCircle size={16} /> Ajouter Membre
              </button>
            </div>

            <div className="space-y-4 md:space-y-5">
              <AnimatePresence mode="popLayout">
                {members.map((member) => (
                  <motion.div 
                    key={member.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 p-4 md:p-5 bg-white/5 rounded-2xl md:rounded-[2rem] border border-white/5 items-center group hover:bg-white/10 transition-all"
                  >
                    
                    {/* INTEGRATION CLOUDINARY : MEMBRE DYNAMIQUE */}
                    <div className="lg:col-span-3">
                       <DocumentUploadHUD 
                         label="Photo Membre" 
                         onUploadSuccess={(url) => updateMemberPhoto(member.id, url)}
                       />
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 gap-3">
                       <InputHUD label="Identité" dark placeholder="NOM & PRÉNOMS" />
                       <InputHUD label="NNI Social" dark placeholder="CI-XXXXXXXX" />
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 gap-3">
                       <InputHUD label="Lien" type="select" options={["Conjoint", "Enfant", "Parent"]} dark />
                       <InputHUD label="Âge" type="number" placeholder="00" dark />
                    </div>
                    
                    <div className="lg:col-span-3 flex justify-end h-full items-start">
                       <button 
                        type="button" onClick={() => removeMember(member.id)}
                        className="w-full lg:w-auto px-4 py-3 md:px-5 md:py-4 mt-2 lg:mt-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl md:rounded-2xl transition-all border border-red-500/20 flex items-center justify-center gap-2"
                       >
                         <Trash2 size={16} />
                         <span className="lg:hidden text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Retirer</span>
                       </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* VALIDATION FINALE */}
          <button 
            disabled={isSubmitting}
            onClick={handleFinalSubmit}
            className="w-full py-6 md:py-8 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-black rounded-3xl md:rounded-[3rem] shadow-lg md:shadow-[0_20px_60px_rgba(234,88,12,0.4)] transition-all uppercase tracking-widest flex flex-col items-center gap-1.5 md:gap-2 group active:scale-95 border border-orange-400/20"
          >
             {isSubmitting ? (
               <div className="flex items-center gap-3 animate-pulse">
                 <Cpu size={18} className="animate-spin md:w-5 md:h-5" />
                 <span className="text-[9px] md:text-xs">Cryptage en cours...</span>
               </div>
             ) : (
               <>
                 <div className="flex items-center gap-2 md:gap-3">
                   <Save size={18} className="group-hover:rotate-12 transition-transform md:w-5 md:h-5" />
                   <span className="text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.4em]">Soumettre la déclaration</span>
                 </div>
                 <span className="text-[6px] md:text-[7px] opacity-60 font-mono tracking-widest uppercase italic">Protocole AES-512 CI-01</span>
               </>
             )}
          </button>

        </form>
      </div>
    </div>
  );
};

// --- COMPOSANT INPUT HUD UNIFIÉ & MINIATURISÉ ---
const InputHUD = ({ label, type = "text", options, placeholder, icon, dark }: any) => (
  <div className="space-y-1.5 group">
    <label className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest ml-2 md:ml-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{React.cloneElement(icon, { size: 14, className: "w-3.5 h-3.5" })}</div>}
      {type === "select" ? (
        <select className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border outline-none focus:border-orange-500 transition-all font-bold text-[9px] md:text-[11px] appearance-none cursor-pointer ${dark ? 'bg-black/40 border-white/5 text-slate-300' : 'bg-white/5 border-white/10 text-white'}`}>
          {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input 
          type={type} placeholder={placeholder} 
          className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border outline-none focus:border-orange-500 transition-all font-bold text-[9px] md:text-[11px] ${icon ? 'pl-9' : ''} ${dark ? 'bg-black/40 border-white/5 text-slate-300 placeholder:text-slate-800' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-700'}`} 
        />
      )}
    </div>
  </div>
);

export default CensusDetails;