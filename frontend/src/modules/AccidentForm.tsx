// src/modules/AccidentForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { Car, AlertTriangle, MapPin, Users, ShieldAlert, UploadCloud, FileText } from "lucide-react";

const AccidentForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    // --- LOCALISATION & DATE ---
    accidentDate: "",
    accidentTime: "",
    location: "",
    roadName: "",
    
    // --- VÉHICULE & CHAUFFEUR ---
    vehicleType: "Voiture Particulière",
    vehicleBrand: "", 
    vehicleColor: "",
    licensePlate: "", 
    driverName: "",
    driverLicenseNumber: "", 
    
    // --- NATURE & CAUSE ---
    accidentType: "Collision",
    gravity: "Matériel",
    primaryCause: "Vitesse excessive", 
    weatherCondition: "Beau temps",

    // --- BILAN HUMAIN ---
    injuredCount: "0",
    deceasedCount: "0",

    // --- SIGNALEMENT ---
    reporterNNI: "",
    description: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/security/incidents', {
        type: 'ACCIDENT',
        ...formData,
        scenePhoto: preview,
        status: "SIGNALÉ",
      });
      toast.success("Rapport d'accident transmis aux autorités !");
    } catch (error) {
      toast.error("Erreur lors de la transmission du rapport.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Rapport de Sinistre Routier</h2>
          <p className="text-red-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Base de données Sécurité Civile CI</p>
        </div>
        <div className="bg-red-50 text-red-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-2 shadow-sm">
          <ShieldAlert size={16} /> Constat Officiel
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : VÉHICULE & CHAUFFEUR */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
              <Car size={20} />
            </span>
            Identification du Véhicule & Conducteur
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <Select label="Type de Véhicule" name="vehicleType" onChange={handleChange}>
              <option value="Voiture Particulière">Voiture Particulière</option>
              <option value="Taxi (Woro-Woro/Orange)">Taxi</option>
              <option value="Moteur / Gbaka">Gbaka / Minibus</option>
              <option value="Poids Lourd">Poids Lourd / Camion</option>
              <option value="Deux-roues">Moto / Tricycle</option>
            </Select>
            <Input label="Marque & Modèle" name="vehicleBrand" placeholder="Ex: Toyota Corolla" onChange={handleChange} required />
            <Input label="Couleur" name="vehicleColor" placeholder="Ex: Blanc" onChange={handleChange} />
            <Input label="Matricule (Plaque)" name="licensePlate" placeholder="Ex: 1234 AB 01" onChange={handleChange} required />
            <Input label="Nom du Chauffeur" name="driverName" placeholder="Identité complète" onChange={handleChange} required />
            <Input label="N° Permis de Conduire" name="driverLicenseNumber" placeholder="Ex: CI-000000" onChange={handleChange} required />
          </div>
        </div>

        {/* SECTION 2 : CIRCONSTANCES & PHOTO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <AlertTriangle size={250} />
            </div>

            <h3 className="text-xs font-black text-red-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <MapPin size={18} /> Circonstances & Localisation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <SelectDark label="Cause Présumée" name="primaryCause" onChange={handleChange}>
                <option value="Vitesse excessive">Vitesse excessive</option>
                <option value="Fatigue / Somnolence">Fatigue / Somnolence</option>
                <option value="Alcool / Stupéfiants">Alcool / Stupéfiants</option>
                <option value="Défaillance mécanique">Défaillance mécanique</option>
                <option value="Mauvais dépassement">Mauvais dépassement</option>
                <option value="Téléphone au volant">Téléphone au volant</option>
              </SelectDark>

              <SelectDark label="Conditions Météo" name="weatherCondition" onChange={handleChange}>
                <option value="Beau temps">Beau temps / Jour</option>
                <option value="Pluie">Pluie / Chaussée glissante</option>
                <option value="Nuit">Nuit sans éclairage</option>
                <option value="Brouillard">Brouillard épais</option>
              </SelectDark>

              <InputDark label="Date de l'accident" name="accidentDate" type="date" onChange={handleChange} required />
              <InputDark label="Heure exacte" name="accidentTime" type="time" onChange={handleChange} required />
              
              <div className="md:col-span-2">
                <InputDark label="Localisation précise" name="location" placeholder="Ex: Autoroute du Nord, PK 24" onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* UPLOAD PHOTO */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col justify-between items-center text-center">
            <div className="w-full">
               <h3 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Preuve Visuelle</h3>
               <p className="text-[11px] font-bold text-slate-800 mb-6">Photo de la Scène / Dégâts</p>
            </div>

            <div className="w-full h-48 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative group hover:border-red-400 transition-colors cursor-pointer shadow-inner">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud size={32} className="text-slate-300 mb-2 group-hover:text-red-500 transition-colors" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-red-600 transition-colors">Uploader une image</span>
                </>
              )}
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
            </div>
            
            <p className="text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-[0.2em]">Obligatoire pour l'assurance</p>
          </div>
        </div>

        {/* SECTION 3 : BILAN HUMAIN & DÉTAILS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
               <Users size={16} />
            </span>
            Bilan Humain & Récit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input label="Nombre de Blessés" name="injuredCount" type="number" onChange={handleChange} placeholder="0" />
            <Input label="Nombre de Décès" name="deceasedCount" type="number" onChange={handleChange} placeholder="0" />
            
            <div className="lg:col-span-2">
              <Input label="NNI de l'Agent Rapporteur" name="reporterNNI" onChange={handleChange} placeholder="Votre Numéro National" required />
            </div>

            <div className="lg:col-span-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Description des faits (Croquis/Récit)</label>
              <textarea 
                name="description" 
                rows={4} 
                className="w-full p-6 bg-slate-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-red-200 focus:ring-2 focus:ring-red-50 transition-all text-sm font-bold placeholder-slate-300 shadow-inner"
                onChange={handleChange}
                placeholder="Décrivez succinctement le déroulement de l'accident..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-2/3 py-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-black rounded-[2rem] shadow-2xl shadow-red-900/30 uppercase tracking-[0.3em] text-sm hover:from-red-700 hover:to-red-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? "TRANSMISSION..." : "ENREGISTRER LE RAPPORT D'ACCIDENT"}
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
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-red-200 focus:shadow-md ${className}`} 
    />
  </div>
);

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label>{label}</Label>}
    <select 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-red-200 focus:shadow-md ${className}`}
    >
      {children}
    </select>
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
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500 transition-all"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default AccidentForm;