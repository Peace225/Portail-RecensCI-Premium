// src/modules/BirthForm.tsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
// CORRECTION ICI : Remplacement de UserFemale par UserRound
import { Baby, UserRound, User, Camera, ShieldCheck, Stethoscope } from "lucide-react";

const BirthForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({ mother: "", father: "" });

  const [formData, setFormData] = useState({
    // --- INFOS BÉBÉ ---
    babyFirstName: "",
    babyLastName: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    weight: "",
    height: "",
    hospitalName: "",
    cityOfBirth: "",

    // --- INFOS MÈRE ---
    motherFullName: "",
    motherNNI: "",
    motherProfession: "",
    motherMaritalStatus: "Célibataire",
    motherLocation: "",

    // --- INFOS PÈRE ---
    fatherFullName: "",
    fatherNNI: "",
    fatherProfession: "",
    fatherMaritalStatus: "Célibataire",
    fatherLocation: "",
    
    doctorName: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, role: 'mother' | 'father') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [role]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "birth_records"), {
        ...formData,
        motherPhoto: previews.mother,
        fatherPhoto: previews.father,
        registeredAt: serverTimestamp(),
        status: "EN_ATTENTE_VALIDATION",
      });
      
      toast.success("Naissance déclarée et transmise à l'ONECI !");
      // Optionnel: Reset du formulaire
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement de l'acte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Registre des Naissances</h2>
          <p className="text-orange-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Système National de Sécurisation d'État Civil</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 flex items-center gap-2">
          <ShieldCheck size={16} /> Acte Sécurisé
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : LE NOUVEAU-NÉ */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
              <Baby size={20} />
            </span>
            Identité du Nouveau-né
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-2"><Input label="Prénoms" name="babyFirstName" onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Input label="Nom de famille" name="babyLastName" onChange={handleChange} required /></div>
            
            <Select label="Sexe" name="gender" onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </Select>
            <Input label="Date de naissance" name="birthDate" type="date" onChange={handleChange} required />
            <Input label="Heure" name="birthTime" type="time" onChange={handleChange} required />
            
            <div className="grid grid-cols-2 gap-4">
               <Input label="Poids (kg)" name="weight" type="number" step="0.01" onChange={handleChange} placeholder="Ex: 3.2" />
               <Input label="Taille (cm)" name="height" type="number" onChange={handleChange} placeholder="Ex: 50" />
            </div>

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <Input label="Lieu de Naissance (Commune)" name="cityOfBirth" onChange={handleChange} required placeholder="Ex: Cocody" />
                <Input label="Établissement / Maternité" name="hospitalName" onChange={handleChange} required placeholder="Ex: CHU de Cocody" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* SECTION 2 : LA MÈRE */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-pink-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
                 {/* CORRECTION ICI : Utilisation de UserRound */}
                 <UserRound size={20} />
              </span>
              Filiation Maternelle
            </h3>
            
            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-pink-200 overflow-hidden flex items-center justify-center relative group-hover:border-pink-400 transition-colors shadow-inner">
                {previews.mother ? <img src={previews.mother} className="w-full h-full object-cover" /> : <Camera size={32} className="text-pink-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'mother')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-pink-400 mt-3 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">Photo d'identité requise</p>
            </div>

            <div className="space-y-4 relative z-10">
              <Input label="Nom Complet (Mère)" name="motherFullName" placeholder="Nom et Prénoms" onChange={handleChange} required />
              <Input label="N° National d'Identité (NNI)" name="motherNNI" placeholder="Ex: C0000000000" onChange={handleChange} required />
              
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Profession" name="motherProfession" onChange={handleChange} />
                 <Select label="Situation" name="motherMaritalStatus" onChange={handleChange}>
                   <option value="Celibataire">Célibataire</option>
                   <option value="Mariee">Mariée</option>
                   <option value="Divorcee">Divorcée / Veuve</option>
                 </Select>
              </div>
              <Input label="Lieu de résidence" name="motherLocation" onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 3 : LE PÈRE */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-blue-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                 <User size={20} />
              </span>
              Filiation Paternelle
            </h3>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-blue-200 overflow-hidden flex items-center justify-center relative group-hover:border-blue-400 transition-colors shadow-inner">
                {previews.father ? <img src={previews.father} className="w-full h-full object-cover" /> : <Camera size={32} className="text-blue-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'father')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-blue-400 mt-3 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Photo d'identité (Optionnel)</p>
            </div>

            <div className="space-y-4 relative z-10">
              <Input label="Nom Complet (Père)" name="fatherFullName" placeholder="Nom et Prénoms" onChange={handleChange} />
              <Input label="N° National d'Identité (NNI)" name="fatherNNI" placeholder="Ex: C0000000000" onChange={handleChange} />
              
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Profession" name="fatherProfession" onChange={handleChange} />
                 <Select label="Situation" name="fatherMaritalStatus" onChange={handleChange}>
                   <option value="Celibataire">Célibataire</option>
                   <option value="Mariee">Marié</option>
                   <option value="Divorcee">Divorcé / Veuf</option>
                 </Select>
              </div>
              <Input label="Lieu de résidence" name="fatherLocation" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* SECTION BASSE : VALIDATION MÉDICALE */}
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 opacity-10 pointer-events-none">
             <Stethoscope size={200} />
          </div>

          <div className="flex-1 w-full relative z-10">
            <label className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3 ml-2">
              <Stethoscope size={16} /> Praticien Accoucheur
            </label>
            <input 
              name="doctorName" 
              className="w-full bg-slate-800 border-none rounded-[2rem] p-6 text-white font-bold placeholder-slate-500 focus:ring-2 focus:ring-orange-500 transition-all outline-none" 
              placeholder="Nom complet du Médecin ou de la Sage-femme" 
              onChange={handleChange} 
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-12 py-6 bg-orange-600 text-white font-black rounded-[2rem] shadow-xl shadow-orange-900/40 uppercase tracking-[0.2em] text-sm hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 relative z-10 flex items-center justify-center gap-3 shrink-0"
          >
            {loading ? "TRAITEMENT..." : "SCELLER L'ACTE DE NAISSANCE"}
          </button>
        </div>
      </form>
    </div>
  );
};

// HELPERS UI
const Label = ({ children, className = "" }: any) => (
  <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ label, className = "", ...props }: any) => (
  <div>
    {label && <Label className={className.includes('text-white') ? 'text-slate-500' : ''}>{label}</Label>}
    <input 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-orange-200 focus:shadow-md ${className}`} 
    />
  </div>
);

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label className={className.includes('text-white') ? 'text-slate-500' : ''}>{label}</Label>}
    <select 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-orange-200 focus:shadow-md ${className}`}
    >
      {children}
    </select>
  </div>
);

export default BirthForm;