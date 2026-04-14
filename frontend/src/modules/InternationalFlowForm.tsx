// src/modules/InternationalFlowForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { PlaneLanding, PlaneTakeoff, UserCheck, MapPin, Briefcase, ShieldCheck, UploadCloud, Globe2 } from "lucide-react";

type FlowDirection = "ENTRÉE" | "SORTIE";

const InternationalFlowForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<FlowDirection>("ENTRÉE");
  const [docPreview, setDocPreview] = useState("");

  const [formData, setFormData] = useState({
    // --- IDENTITÉ VOYAGEUR ---
    lastName: "",
    firstName: "",
    age: "",
    nni: "", 
    passportNumber: "",
    nationality: "Ivoirienne",
    birthDate: "",

    // --- DÉTAILS DU VOYAGE ---
    travelDate: "",
    borderPost: "Aéroport FHB Abidjan", 
    transportMode: "Aérien", 
    originCountry: "",
    destinationCountry: "Côte d'Ivoire",
    
    // --- MOTIFS & SÉJOUR ---
    travelReason: "Tourisme", 
    visaType: "Aucun", 
    stayDuration: "", 

    // --- CONTRÔLE ---
    officerMatricule: "",
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
    setLoading(true);
    try {
      await apiService.post('/events/migration', {
        ...formData,
        direction,
        passportScan: docPreview,
        migrationType: 'INTERNATIONAL',
      });
      toast.success(`Mouvement d'${direction.toLowerCase()} enregistré au registre des frontières.`);
    } catch (error) {
      toast.error("Erreur de communication avec le serveur central.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Contrôle aux Frontières</h2>
          <p className="text-blue-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Police de l'Air et des Frontières • Côte d'Ivoire</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2 shadow-sm">
          <Globe2 size={16} className={direction === "ENTRÉE" ? "text-blue-600" : "text-slate-600"} /> Flux Migratoires
        </div>
      </div>

      {/* COMMUTATEUR ENTRÉE / SORTIE PREMIUM */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-2 rounded-[3rem] flex gap-2 shadow-lg shadow-slate-200/50 border border-slate-100 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => { setDirection("ENTRÉE"); setFormData({...formData, destinationCountry: "Côte d'Ivoire", originCountry: ""}) }}
            className={`flex-1 md:flex-none px-10 py-4 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${direction === "ENTRÉE" ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20 scale-100" : "text-slate-500 hover:bg-slate-50 scale-95"}`}
          >
            <PlaneLanding size={20} /> Entrée sur le Territoire
          </button>
          <button 
            type="button"
            onClick={() => { setDirection("SORTIE"); setFormData({...formData, originCountry: "Côte d'Ivoire", destinationCountry: ""}) }}
            className={`flex-1 md:flex-none px-10 py-4 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${direction === "SORTIE" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-100" : "text-slate-500 hover:bg-slate-50 scale-95"}`}
          >
            <PlaneTakeoff size={20} /> Sortie du Territoire
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : VOYAGEUR */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-full -z-0 transition-transform group-hover:scale-110 ${direction === "ENTRÉE" ? "bg-blue-50" : "bg-slate-50"}`}></div>
          
          <h3 className={`text-sm font-black mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10 ${direction === "ENTRÉE" ? "text-blue-800" : "text-slate-800"}`}>
            <span className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${direction === "ENTRÉE" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-700"}`}>
              <UserCheck size={20} />
            </span>
            Identification du Voyageur
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-2"><Input label="Nom (Patronyme)" name="lastName" onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Input label="Prénoms" name="firstName" onChange={handleChange} required /></div>
            
            <Input label="Date de Naissance" name="birthDate" type="date" onChange={handleChange} required />
            <Input label="Âge" name="age" type="number" onChange={handleChange} required />
            <Input label="Nationalité" name="nationality" onChange={handleChange} required />
            <Input label="N° Passeport / CNI" name="passportNumber" onChange={handleChange} required />
            
            <div className="md:col-span-4">
               <Input label="N° National d'Identité (Si Ivoirien/Résident)" name="nni" placeholder="Ex: C0000000000" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* SECTION 2 : LOGISTIQUE VOYAGE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Carte Logistique Dark */}
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <MapPin size={250} />
            </div>

            <h3 className="text-xs font-black text-blue-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
               <MapPin size={18} /> Détails du Mouvement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <InputDark label="Pays de Provenance" name="originCountry" value={formData.originCountry} onChange={handleChange} required disabled={direction === "SORTIE"} />
              <InputDark label="Pays de Destination" name="destinationCountry" value={formData.destinationCountry} onChange={handleChange} required disabled={direction === "ENTRÉE"} />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 mt-2">
                <SelectDark label="Poste Frontière" name="borderPost" onChange={handleChange}>
                  <option value="Aéroport FHB Abidjan">Aéroport FHB Abidjan</option>
                  <option value="Port Autonome d'Abidjan">Port Autonome d'Abidjan</option>
                  <option value="Frontière Noé (Ghana)">Frontière Noé (Ghana)</option>
                  <option value="Frontière Ouangolodougou">Frontière Ouangolodougou (Burkina)</option>
                  <option value="Frontière Laleraba">Frontière Laleraba</option>
                </SelectDark>

                <SelectDark label="Mode de Transport" name="transportMode" onChange={handleChange}>
                  <option value="Aérien">Aérien</option>
                  <option value="Terrestre">Terrestre</option>
                  <option value="Maritime">Maritime</option>
                </SelectDark>
              </div>

              <InputDark label="Date du mouvement" name="travelDate" type="date" onChange={handleChange} required />
              <InputDark label="Durée de séjour prévue (Jours)" name="stayDuration" type="number" onChange={handleChange} placeholder="Laisser vide si résident" />
            </div>
          </div>

          {/* SCAN PASSEPORT */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between items-center text-center">
            <div className="w-full">
               <h3 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Contrôle Biométrique</h3>
               <p className="text-[11px] font-bold text-slate-800 mb-6">Scan du Passeport ou Visa</p>
            </div>

            <div className="w-full h-48 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative group hover:border-blue-400 transition-colors cursor-pointer shadow-inner">
              {docPreview ? (
                <img src={docPreview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud size={32} className="text-slate-300 mb-2 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Uploader le Document</span>
                </>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
            
            <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Document de voyage obligatoire</p>
          </div>
        </div>

        {/* SECTION 3 : MOTIF & CONTRÔLE */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
               <Briefcase size={16} />
            </span>
            Motif & Validation de l'Agent
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Select label="Motif du voyage" name="travelReason" onChange={handleChange}>
              <option value="Tourisme">Tourisme / Loisirs</option>
              <option value="Travail">Travail / Affaires / Mission</option>
              <option value="Famille">Regroupement Familial</option>
              <option value="Etudes">Études / Stage</option>
              <option value="Refugie">Demande d'Asile / Réfugié</option>
              <option value="Retour">Retour au pays de résidence</option>
            </Select>
            <Select label="Type de Visa présenté" name="visaType" onChange={handleChange}>
              <option value="Aucun">Sans Visa (Espace CEDEAO)</option>
              <option value="Biometrique">Visa Biométrique (Ambassade)</option>
              <option value="E-Visa">E-Visa (Délivré en ligne)</option>
              <option value="Courtoisie">Visa de Courtoisie / Diplomatique</option>
            </Select>
            <div className="lg:border-l border-slate-100 lg:pl-6">
              <Input label="Matricule de l'Agent de Contrôle" name="officerMatricule" placeholder="Votre matricule PAF" onChange={handleChange} required />
            </div>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full md:w-3/4 py-6 text-white font-black rounded-[2rem] shadow-2xl uppercase tracking-[0.3em] text-sm hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3 ${direction === "ENTRÉE" ? "bg-gradient-to-r from-blue-700 to-blue-500 shadow-blue-900/30 hover:from-blue-800 hover:to-blue-600" : "bg-gradient-to-r from-slate-900 to-slate-700 shadow-slate-900/30 hover:bg-black"}`}
          >
            <ShieldCheck size={20} />
            {loading ? "TRAITEMENT SÉCURISÉ..." : `VALIDER L'${direction} SUR LE TERRITOIRE`}
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

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label>{label}</Label>}
    <select 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-slate-300 focus:shadow-md ${className}`}
    >
      {children}
    </select>
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
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:bg-slate-800/50"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default InternationalFlowForm;