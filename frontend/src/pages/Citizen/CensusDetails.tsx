// src/pages/citizen/CensusDetails.tsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Home, Zap, Save, UserCheck, 
  PlusCircle, Trash2, Fingerprint, Cpu, ShieldCheck,
  Activity, Wifi, Stethoscope, Utensils, Droplets, Phone
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiService";
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
  photoUrl?: string; // <-- Ajout pour stocker l'URL Cloudinary du membre
}

const CensusDetails = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State pour la photo du Chef de Ménage
  const [declarantPhotoUrl, setDeclarantPhotoUrl] = useState<string>("");

  const stats = useMemo(() => ({ total: members.length + 1 }), [members]);

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now(), lastName: "", firstName: "", age: "", religion: "Christianisme", profession: "", relation: "Enfant", nni: "", photoUrl: ""
    };
    setMembers([...members, newMember]);
    toast.success("Nouveau profil rattaché au nœud familial");
  };

  const removeMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
    toast.error("Unité retirée du registre");
  };

  // Fonction pour mettre à jour la photo d'un membre spécifique
  const updateMemberPhoto = (id: number, url: string) => {
    setMembers(members.map(m => m.id === id ? { ...m, photoUrl: url } : m));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    if (!declarantPhotoUrl) {
      toast.error("La photo du Chef de Ménage est requise.");
      setIsSubmitting(false);
      return;
    }

    try {
      await apiService.post('/citizens', {
        fullName: '',
        photoUrl: declarantPhotoUrl,
        household: members,
      });
      toast.success("Données transmises au Cloud Souverain");
    } catch {
      toast.error("Erreur lors de la transmission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans selection:bg-orange-500/30">
      
      <style>{`
        @keyframes scan { 0% { top: -100%; opacity: 0; } 50% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 130, 0, 0.3); border-radius: 10px; }
        .glass-hud { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      {/* --- WIDGET ANALYSE LIVE --- */}
      <motion.div initial={{ x: 100 }} animate={{ x: 0 }} className="fixed bottom-10 right-10 z-[100] hidden lg:block pointer-events-none">
        <div className="glass-hud p-6 rounded-[2rem] border border-orange-500/30 w-64 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Calculateur IA</span>
            <Activity size={14} className="text-orange-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-bold">Membres Détectés</p>
          <p className="text-4xl font-black text-white italic">0{stats.total}</p>
          <div className="h-px w-full bg-white/10 my-4" />
          <p className="text-[8px] text-slate-600 font-mono leading-tight">STATUS: SCANNING_LIFE_SIGNS...</p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4 border-l-4 border-orange-500 pl-8">
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
            Recensement <span className="text-orange-500">National</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.4em]">Node ID: CI-RE-2026-X</p>
        </div>

        <form className="space-y-12 pb-32" onSubmit={(e) => e.preventDefault()}>
          
          {/* 1. CHEF DE MÉNAGE (DÉCLARANT) */}
          <section className="glass-hud p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden group">
            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-10">
              <div className="flex items-center gap-4 text-orange-500">
                <UserCheck size={28} />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Chef de Ménage (Déclarant)</h3>
              </div>
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12">
               {/* INTEGRATION CLOUDINARY : CHEF DE MÉNAGE */}
               <div className="w-full lg:w-64 shrink-0">
                 <DocumentUploadHUD 
                   label="Scan Biométrique" 
                   onUploadSuccess={setDeclarantPhotoUrl} 
                 />
               </div>

               <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <InputHUD label="Nom de famille" placeholder="KOUAME" />
                  <InputHUD label="Prénoms" placeholder="JEAN MARC" />
                  <InputHUD label="Numéro de Téléphone" icon={<Phone size={14}/>} placeholder="07 00 00 00 00" />
                  <InputHUD label="NNI / Sécurité Sociale" icon={<Fingerprint size={14}/>} placeholder="CI-0102938475" />
                  <InputHUD label="Religion" type="select" options={["Christianisme", "Islam", "Animisme", "Autre"]} />
                  <InputHUD label="Profession" placeholder="EX: ARCHITECTE SYSTÈME" />
               </div>
            </div>
          </section>

          {/* 2. ACCÈS AUX SERVICES & NIVEAU DE VIE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-hud p-8 rounded-[3rem] space-y-6">
              <div className="flex items-center gap-3 text-orange-500 mb-4">
                <Home size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Habitat & Base</h3>
              </div>
              <InputHUD label="Type de Logement" type="select" options={["Villa", "Appartement", "Habitat Traditionnel"]} />
              <div className="grid grid-cols-2 gap-4">
                <InputHUD label="Accès Électricité" icon={<Zap size={14}/>} type="select" options={["CIE", "Solaire", "Aucun"]} />
                <InputHUD label="Accès à l'Eau" icon={<Droplets size={14}/>} type="select" options={["SODECI", "Forage", "Puits"]} />
              </div>
            </div>

            <div className="glass-hud p-8 rounded-[3rem] space-y-6">
              <div className="flex items-center gap-3 text-blue-500 mb-4">
                <Activity size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Services Numériques & Santé</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputHUD label="Accès Internet" icon={<Wifi size={14}/>} type="select" options={["Fibre/ADSL", "4G/5G", "Aucun"]} />
                <InputHUD label="Accès aux Soins" icon={<Stethoscope size={14}/>} type="select" options={["Assurance/CMU", "Privé", "Aucun"]} />
              </div>
              <InputHUD label="Repas par jour" icon={<Utensils size={14}/>} type="select" options={["1 repas", "2 repas", "3 repas", "Plus de 3"]} />
            </div>
          </div>

          {/* 3. MEMBRES RATTACHÉS */}
          <section className="bg-slate-900/50 border border-orange-500/10 p-8 md:p-12 rounded-[3.5rem] space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 text-white">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-600 rounded-2xl shadow-lg"><Users size={28} /></div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Composition du Foyer</h3>
              </div>
              <button 
                type="button" onClick={addMember}
                className="px-8 py-4 bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 active:scale-95 shadow-xl"
              >
                <PlusCircle size={20} /> Ajouter un Membre
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {members.map((member) => (
                  <motion.div 
                    key={member.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 items-center group hover:bg-white/10 transition-all"
                  >
                    
                    {/* INTEGRATION CLOUDINARY : MEMBRE DYNAMIQUE */}
                    <div className="lg:col-span-3">
                       <DocumentUploadHUD 
                         label="Photo Membre" 
                         onUploadSuccess={(url) => updateMemberPhoto(member.id, url)}
                       />
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 gap-4">
                       <InputHUD label="Identité" dark placeholder="NOM & PRÉNOMS" />
                       <InputHUD label="NNI Social" dark placeholder="CI-XXXXXXXX" />
                    </div>
                    
                    <div className="lg:col-span-3 grid grid-cols-1 gap-4">
                       <InputHUD label="Lien" type="select" options={["Conjoint", "Enfant", "Parent"]} dark />
                       <InputHUD label="Âge" type="number" placeholder="00" dark />
                    </div>
                    
                    <div className="lg:col-span-3 flex justify-end h-full items-start">
                       <button 
                        type="button" onClick={() => removeMember(member.id)}
                        className="w-full lg:w-auto px-6 py-4 mt-6 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all border border-red-500/20 flex items-center justify-center gap-2"
                       >
                         <Trash2 size={20} />
                         <span className="lg:hidden text-xs font-bold uppercase tracking-widest">Retirer</span>
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
            className="w-full py-10 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-black rounded-[3rem] shadow-[0_20px_60px_rgba(234,88,12,0.4)] transition-all uppercase tracking-[0.4em] flex flex-col items-center gap-2 group active:scale-95 border border-orange-400/20"
          >
             {isSubmitting ? (
               <div className="flex items-center gap-4 animate-pulse">
                 <Cpu size={24} className="animate-spin" />
                 <span>Cryptage & Transmission en cours...</span>
               </div>
             ) : (
               <>
                 <div className="flex items-center gap-4">
                   <Save size={24} className="group-hover:rotate-12 transition-transform" />
                   <span>Soumettre la déclaration souveraine</span>
                 </div>
                 <span className="text-[8px] opacity-60 font-mono tracking-widest uppercase italic">Protocole de sécurité AES-512 Terminal CI-01</span>
               </>
             )}
          </button>

        </form>
      </div>
    </div>
  );
};

// --- COMPOSANT INPUT HUD UNIFIÉ ---
const InputHUD = ({ label, type = "text", options, placeholder, icon, dark }: any) => (
  <div className="space-y-2 group">
    <label className={`text-[9px] font-black uppercase tracking-widest ml-3 ${dark ? 'text-slate-600' : 'text-slate-500'}`}>{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
      {type === "select" ? (
        <select className={`w-full p-4 rounded-2xl border outline-none focus:border-orange-500 transition-all font-bold text-sm appearance-none cursor-pointer ${dark ? 'bg-black/40 border-white/5 text-slate-300' : 'bg-white/5 border-white/10 text-white'}`}>
          {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
        </select>
      ) : (
        <input 
          type={type} placeholder={placeholder} 
          className={`w-full p-4 rounded-2xl border outline-none focus:border-orange-500 transition-all font-bold text-sm ${icon ? 'pl-12' : ''} ${dark ? 'bg-black/40 border-white/5 text-slate-300 placeholder:text-slate-800' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-700'}`} 
        />
      )}
    </div>
  </div>
);

export default CensusDetails;