// src/modules/MarriageForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { HeartHandshake, User, UserRound, Camera, FileCheck, Users, MapPin, Scale } from "lucide-react";

const MarriageForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({ spouse1: "", spouse2: "" });

  const [formData, setFormData] = useState({
    // --- L'ÉPOUX ---
    spouse1LastName: "", 
    spouse1FirstName: "", 
    spouse1Age: "",
    spouse1NNI: "", 
    spouse1Profession: "",
    spouse1BirthDate: "",

    // --- L'ÉPOUSE ---
    spouse2LastName: "", 
    spouse2FirstName: "", 
    spouse2Age: "",
    spouse2NNI: "", 
    spouse2Profession: "",
    spouse2BirthDate: "",

    // --- CONTRAT MATRIMONIAL ---
    weddingDate: "",
    weddingPlace: "",
    regime: "Monogamie", 
    propertyRegime: "Communauté de biens",
    
    // --- TÉMOINS ---
    witness1FullName: "", 
    witness1NNI: "",
    witness2FullName: "", 
    witness2NNI: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'spouse1' | 'spouse2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
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
      await apiService.post('/events/marriage', {
        ...formData,
        photos: previews,
        status: "ACTE_VALIDE",
      });
      toast.success("Acte de Mariage scellé et enregistré au registre civil !");
    } catch (error) {
      toast.error("Erreur de transmission sécurisée.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Registre des Mariages</h2>
          <p className="text-rose-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Célébration d'Union Civile • Côte d'Ivoire</p>
        </div>
        <div className="bg-rose-50 text-rose-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100 flex items-center gap-2 shadow-sm">
          <HeartHandshake size={16} /> Acte Légal
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : LES ÉPOUX (Grille Symétrique) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* L'ÉPOUX (Groom) - Thème Bleu */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-blue-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <User size={20} />
              </span>
              Identité de l'Époux
            </h3>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-blue-200 overflow-hidden flex items-center justify-center relative group-hover:border-blue-400 transition-colors shadow-inner">
                {previews.spouse1 ? <img src={previews.spouse1} className="w-full h-full object-cover" /> : <Camera size={32} className="text-blue-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'spouse1')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-blue-400 mt-3 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Photo d'identité</p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom" name="spouse1LastName" onChange={handleChange} required />
                <Input label="Prénoms" name="spouse1FirstName" onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date de Naissance" name="spouse1BirthDate" type="date" onChange={handleChange} />
                <Input label="Âge" name="spouse1Age" type="number" onChange={handleChange} required />
              </div>
              <Input label="N° National (NNI)" name="spouse1NNI" onChange={handleChange} required />
              <Input label="Profession" name="spouse1Profession" onChange={handleChange} required />
            </div>
          </div>

          {/* L'ÉPOUSE (Bride) - Thème Rose */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-pink-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
                <UserRound size={20} />
              </span>
              Identité de l'Épouse
            </h3>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-pink-200 overflow-hidden flex items-center justify-center relative group-hover:border-pink-400 transition-colors shadow-inner">
                {previews.spouse2 ? <img src={previews.spouse2} className="w-full h-full object-cover" /> : <Camera size={32} className="text-pink-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'spouse2')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-pink-400 mt-3 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">Photo d'identité</p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom de jeune fille" name="spouse2LastName" onChange={handleChange} required />
                <Input label="Prénoms" name="spouse2FirstName" onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date de Naissance" name="spouse2BirthDate" type="date" onChange={handleChange} />
                <Input label="Âge" name="spouse2Age" type="number" onChange={handleChange} required />
              </div>
              <Input label="N° National (NNI)" name="spouse2NNI" onChange={handleChange} required />
              <Input label="Profession" name="spouse2Profession" onChange={handleChange} required />
            </div>
          </div>

        </div>

        {/* SECTION 2 : CONTRAT MATRIMONIAL & TÉMOINS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contrat Matrimonial */}
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <Scale size={200} />
            </div>

            <h3 className="text-xs font-black text-rose-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <FileCheck size={18} /> Dispositions du Contrat Matrimonial
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <InputDark label="Date de l'union" name="weddingDate" type="date" onChange={handleChange} required />
              <InputDark label="Mairie / Circonscription" name="weddingPlace" placeholder="Ex: Mairie de Cocody" onChange={handleChange} required />
              
              <SelectDark label="Régime Matrimonial" name="regime" onChange={handleChange}>
                <option value="Monogamie">Monogamie</option>
                <option value="Polygamie">Polygamie</option>
              </SelectDark>
              
              <SelectDark label="Option des Biens" name="propertyRegime" onChange={handleChange}>
                <option value="Communauté de biens">Communauté de biens</option>
                <option value="Séparation de biens">Séparation de biens</option>
              </SelectDark>
            </div>
          </div>

          {/* Témoins Majeurs */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                 <Users size={16} />
              </span>
              Témoins Majeurs
            </h3>

            <div className="space-y-6">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <Label>1er Témoin (Côté Époux)</Label>
                <div className="space-y-3 mt-2">
                  <input name="witness1FullName" placeholder="Nom Complet" className="w-full p-3 rounded-xl outline-none font-bold text-sm" onChange={handleChange} required />
                  <input name="witness1NNI" placeholder="NNI du témoin" className="w-full p-3 rounded-xl outline-none font-bold text-sm" onChange={handleChange} required />
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <Label>2ème Témoin (Côté Épouse)</Label>
                <div className="space-y-3 mt-2">
                  <input name="witness2FullName" placeholder="Nom Complet" className="w-full p-3 rounded-xl outline-none font-bold text-sm" onChange={handleChange} required />
                  <input name="witness2NNI" placeholder="NNI du témoin" className="w-full p-3 rounded-xl outline-none font-bold text-sm" onChange={handleChange} required />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-2/3 py-6 bg-gradient-to-r from-rose-600 to-rose-500 text-white font-black rounded-[2rem] shadow-2xl shadow-rose-900/30 uppercase tracking-[0.3em] text-sm hover:from-rose-700 hover:to-rose-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "TRAITEMENT EN COURS..." : "SCELLER L'ACTE DE MARIAGE"}
          </button>
        </div>

      </form>
    </div>
  );
};

// HELPERS UI LÉGERS (FOND BLANC)
const Label = ({ children, className = "" }: any) => (
  <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ label, className = "", ...props }: any) => (
  <div>
    {label && <Label>{label}</Label>}
    <input 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-slate-300 focus:shadow-md ${className}`} 
    />
  </div>
);

// HELPERS UI SOMBRES (FOND NUIT)
const LabelDark = ({ children }: any) => (
  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
    {children}
  </label>
);

const InputDark = ({ label, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <input 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 transition-all"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default MarriageForm;