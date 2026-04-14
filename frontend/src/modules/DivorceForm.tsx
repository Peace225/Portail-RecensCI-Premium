// src/modules/DivorceForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { Scale, FileSignature, SplitSquareHorizontal, UserX, Landmark, ScrollText, UploadCloud } from "lucide-react";

const DivorceForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [docPreview, setDocPreview] = useState("");

  const [formData, setFormData] = useState({
    // --- EX-ÉPOUX ---
    spouse1LastName: "", 
    spouse1FirstName: "",
    spouse1Age: "", 
    spouse1NNI: "",
    
    // --- EX-ÉPOUSE ---
    spouse2LastName: "", 
    spouse2FirstName: "",
    spouse2Age: "", 
    spouse2NNI: "",
    
    // --- JUGEMENT ---
    marriageActRef: "",
    divorceDate: "",
    courtName: "",
    judgmentNumber: "",
    divorceReason: "Consentement Mutuel", // Ajout d'une cause administrative
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docPreview) return toast.error("La Grosse (copie du jugement) est obligatoire.");

    setLoading(true);
    try {
      await apiService.post('/events/divorce', {
        ...formData,
        judgmentScan: docPreview,
        status: "DISSOLUTION_VALIDÉE",
      });
      toast.success("Dissolution actée et mise à jour dans le registre national.");
    } catch (error) {
      toast.error("Erreur de connexion au registre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Registre des Divorces</h2>
          <p className="text-purple-700 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Dissolution d'Union Civile • Acte Judiciaire</p>
        </div>
        <div className="bg-purple-50 text-purple-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-purple-100 flex items-center gap-2 shadow-sm">
          <Scale size={16} /> Décision de Justice
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : LES EX-CONJOINTS (Séparés visuellement) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* Ligne de cassure visuelle (Desktop seulement) */}
          <div className="hidden lg:flex absolute left-1/2 top-10 bottom-10 -translate-x-1/2 items-center justify-center w-0 border-l-2 border-dashed border-slate-200 z-0">
             <div className="bg-white p-2 rounded-full border border-slate-200 text-slate-300">
               <SplitSquareHorizontal size={24} />
             </div>
          </div>

          {/* L'EX-ÉPOUX */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group z-10">
            <h3 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
                <UserX size={20} />
              </span>
              Identité de l'ex-époux
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom" name="spouse1LastName" onChange={handleChange} required />
                <Input label="Prénoms" name="spouse1FirstName" onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Âge" name="spouse1Age" type="number" onChange={handleChange} required />
                <Input label="N° National (NNI)" name="spouse1NNI" onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* L'EX-ÉPOUSE */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group z-10">
            <h3 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-inner">
                <UserX size={20} />
              </span>
              Identité de l'ex-épouse
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nom de jeune fille" name="spouse2LastName" onChange={handleChange} required />
                <Input label="Prénoms" name="spouse2FirstName" onChange={handleChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Âge" name="spouse2Age" type="number" onChange={handleChange} required />
                <Input label="N° National (NNI)" name="spouse2NNI" onChange={handleChange} required />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 : LE JUGEMENT (Thème Judiciaire Sombre) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <Landmark size={250} />
            </div>

            <h3 className="text-xs font-black text-purple-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <ScrollText size={18} /> Données du Jugement Civil
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <InputDark label="Date du Jugement" name="divorceDate" type="date" onChange={handleChange} required />
              <InputDark label="N° de Jugement (La Grosse)" name="judgmentNumber" placeholder="Ex: JUG-2026-45" onChange={handleChange} required />
              
              <div className="md:col-span-2">
                 <InputDark label="Tribunal ayant rendu la décision" name="courtName" placeholder="Ex: Tribunal de Première Instance d'Abidjan" onChange={handleChange} required />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 mt-2">
                <InputDark label="Réf. Acte de Mariage initial" name="marriageActRef" placeholder="N° de l'acte à annuler" onChange={handleChange} required />
                <SelectDark label="Type de Procédure" name="divorceReason" onChange={handleChange}>
                  <option value="Consentement Mutuel">Consentement Mutuel</option>
                  <option value="Faute">Divorce pour Faute</option>
                  <option value="Rupture Vie Commune">Rupture de la vie commune</option>
                </SelectDark>
              </div>
            </div>
          </div>

          {/* SCAN DU DOCUMENT */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between items-center text-center">
            <div className="w-full">
               <h3 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Document Légal</h3>
               <p className="text-[11px] font-bold text-slate-800 mb-6">Copie de la Grosse ou du Jugement</p>
            </div>

            <div className="w-full h-48 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative group hover:border-purple-400 transition-colors cursor-pointer shadow-inner">
              {docPreview ? (
                <img src={docPreview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud size={32} className="text-slate-300 mb-2 group-hover:text-purple-500 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">Uploader le Scan</span>
                </>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
            
            <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Format PDF ou Image Lisible</p>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-2/3 py-6 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-purple-900/30 uppercase tracking-[0.3em] text-sm hover:from-purple-800 hover:to-indigo-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? "VÉRIFICATION JUDICIAIRE..." : "ACTIVER LA MENTION MARGINALE DE DIVORCE"}
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
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 transition-all"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default DivorceForm;