// src/modules/InternalMigrationForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { MapPinned, User, MapPinOff, ArrowRight, HousePlus, Route, UploadCloud, CheckCircle2 } from "lucide-react";

const InternalMigrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [docPreview, setDocPreview] = useState("");

  const [formData, setFormData] = useState({
    // --- IDENTITÉ ---
    lastName: "",
    firstName: "",
    age: "",
    nni: "", 
    phone: "",
    
    // --- DÉPART (Ancienne adresse) ---
    departureRegion: "",
    departureCity: "",
    departureDate: "",

    // --- ARRIVÉE (Nouvelle adresse) ---
    arrivalRegion: "",
    arrivalCity: "",
    arrivalDistrict: "", 
    arrivalDate: "",
    newAddress: "",

    // --- MOTIFS ---
    migrationReason: "Professionnel", 
    isPermanent: true, 
    householdSize: "1", 
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
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/events/migration', {
        ...formData,
        residenceCertificateScan: docPreview,
      });

      toast.success("Changement de résidence acté dans la base nationale.");
    } catch (error) {
      toast.error("Erreur de synchronisation avec le registre de la population.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Déclaration de Résidence</h2>
          <p className="text-amber-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Suivi Démographique • Mouvement Interne CI</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2 shadow-sm">
          <MapPinned size={16} /> Flux National
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : IDENTITÉ */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
              <User size={20} />
            </span>
            Identification du Citoyen Déclarant
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-2"><Input label="Nom (Patronyme)" name="lastName" onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Input label="Prénoms" name="firstName" onChange={handleChange} required /></div>
            
            <Input label="Âge" name="age" type="number" onChange={handleChange} required />
            <Input label="N° National (NNI)" name="nni" onChange={handleChange} required />
            <div className="md:col-span-2"><Input label="Téléphone de contact" name="phone" onChange={handleChange} required /></div>
          </div>
        </div>

        {/* SECTION 2 : LE MOUVEMENT (Origine -> Destination) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* Flèche centrale (Desktop) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center z-10">
             <div className="bg-white p-4 rounded-full border border-slate-200 text-amber-500 shadow-xl">
               <ArrowRight size={32} />
             </div>
          </div>

          {/* POINT DE DÉPART */}
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 relative overflow-hidden">
            <h3 className="text-xs font-black text-slate-500 mb-8 uppercase tracking-widest flex items-center gap-3">
              <MapPinOff size={18} /> Point de Départ (Ancienne Résidence)
            </h3>
            <div className="space-y-6">
              <Input label="Région de Départ" name="departureRegion" placeholder="Ex: Gôh" onChange={handleChange} required />
              <Input label="Ville / Commune" name="departureCity" placeholder="Ex: Gagnoa" onChange={handleChange} required />
              <Input label="Date du départ" name="departureDate" type="date" onChange={handleChange} required />
            </div>
          </div>

          {/* POINT D'ARRIVÉE */}
          <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-200 relative overflow-hidden shadow-inner">
            <h3 className="text-xs font-black text-amber-700 mb-8 uppercase tracking-widest flex items-center gap-3">
              <HousePlus size={18} /> Point d'Installation (Nouvelle Résidence)
            </h3>
            <div className="space-y-6">
              <Input label="Nouvelle Région" name="arrivalRegion" placeholder="Ex: Lagunes" onChange={handleChange} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ville" name="arrivalCity" placeholder="Ex: Yopougon" onChange={handleChange} required />
                <Input label="Quartier" name="arrivalDistrict" placeholder="Ex: Sicogi" onChange={handleChange} required />
              </div>
              <Input label="Adresse précise" name="newAddress" placeholder="Lot, Ilot, Repère visuel..." onChange={handleChange} />
              <Input label="Date d'installation" name="arrivalDate" type="date" onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* SECTION 3 : ANALYSE & JUSTIFICATIF */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <Route size={250} />
            </div>

            <h3 className="text-xs font-black text-amber-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <Route size={18} /> Analyse du Mouvement Migratoire
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <SelectDark label="Motif du déplacement" name="migrationReason" onChange={handleChange}>
                <option value="Professionnel">Professionnel (Mutation/Emploi)</option>
                <option value="Familial">Familial (Mariage/Rapprochement)</option>
                <option value="Etudes">Études / Formation</option>
                <option value="Securite">Sécurité / Sinistre</option>
                <option value="Retraite">Retour au village / Retraite</option>
              </SelectDark>
              
              <InputDark label="Taille du ménage déplacé (personnes)" name="householdSize" type="number" onChange={handleChange} />
              
              <div className="md:col-span-2 pt-4">
                <label className={`flex items-center justify-between p-6 rounded-[2rem] cursor-pointer border transition-all ${formData.isPermanent ? 'bg-amber-600/20 border-amber-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.isPermanent ? 'border-amber-400 bg-amber-500 text-white' : 'border-slate-500'}`}>
                      {formData.isPermanent && <CheckCircle2 size={16} />}
                    </div>
                    <div>
                       <span className="block text-sm font-black text-white uppercase tracking-widest">Installation Définitive</span>
                       <span className="text-[10px] text-slate-400 font-bold">Cochez si le retour n'est pas prévu.</span>
                    </div>
                  </div>
                  <input type="checkbox" name="isPermanent" checked={formData.isPermanent} onChange={handleChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Certificat de Résidence */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between items-center text-center">
            <div className="w-full">
               <h3 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Pièce Justificative</h3>
               <p className="text-[11px] font-bold text-slate-800 mb-6">Certificat de Résidence (Mairie)</p>
            </div>

            <div className="w-full h-48 rounded-[2rem] bg-amber-50/50 border-2 border-dashed border-amber-200 overflow-hidden flex flex-col items-center justify-center relative group hover:border-amber-400 transition-colors cursor-pointer shadow-inner">
              {docPreview ? (
                <img src={docPreview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud size={32} className="text-amber-400 mb-2 group-hover:text-amber-600 transition-colors" />
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest group-hover:text-amber-700 transition-colors">Uploader le Scan</span>
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
            className="w-full md:w-3/4 py-6 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-black rounded-[2rem] shadow-2xl shadow-amber-900/30 uppercase tracking-[0.3em] text-sm hover:from-amber-700 hover:to-orange-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "MISE À JOUR NATIONALE..." : "ACTIVER LE CHANGEMENT DE DOMICILE"}
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
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-amber-300 focus:shadow-md ${className}`} 
    />
  </div>
);

// HELPERS UI SOMBRES (FOND NUIT)
const LabelDark = ({ children }: any) => (
  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-2">
    {children}
  </label>
);

const InputDark = ({ label, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <input 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 transition-all"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default InternalMigrationForm;