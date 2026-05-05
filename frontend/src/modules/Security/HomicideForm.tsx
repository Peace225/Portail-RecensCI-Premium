// src/modules/Security/HomicideForm.tsx
import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { ShieldAlert, Crosshair, MapPin, UserX, Camera, BookOpen, Fingerprint, Siren } from "lucide-react";

const HomicideForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({ scene: "", victim: "" });

  const [formData, setFormData] = useState({
    // --- L'INCIDENT ---
    incidentType: "Homicide volontaire", // Volontaire, Involontaire, Assassinat
    discoveryDate: "",
    discoveryTime: "",
    locationCity: "",
    locationDistrict: "",
    preciseAddress: "",

    // --- LA VICTIME ---
    victimLastName: "Inconnu",
    victimFirstName: "",
    victimNNI: "",
    victimGender: "",
    estimatedAge: "",

    // --- ÉLÉMENTS DE L'ENQUÊTE ---
    weaponType: "Arme à feu", 
    weaponDetail: "", 
    crimeSceneObservations: "",
    
    // --- AUTORITÉS ---
    investigatingUnit: "", 
    officerInCharge: "",
    officerMatricule: "",
    procureurReferral: "", 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'scene' | 'victim') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [key]: reader.result as string }));
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
      await addDoc(collection(db, "homicides"), {
        ...formData,
        photos: previews,
        registeredAt: serverTimestamp(),
        status: "ENQUÊTE_OUVERTE",
      });
      toast.success("Rapport d'homicide enregistré. Dossier classifié transmis.");
    } catch (error) {
      toast.error("Erreur de sécurisation du dossier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER CLASSIFIÉ */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Rapport Criminel</h2>
          <p className="text-red-700 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Dossier Confidentiel • Ministère de la Sécurité CI</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-slate-700 flex items-center gap-3 shadow-2xl">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          Niveau d'Alerte Max
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : CIRCONSTANCES (Thème Alerte) */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-inner">
              <Siren size={20} />
            </span>
            Circonstances de la découverte
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <div className="lg:col-span-3">
              <Select label="Qualification du Crime" name="incidentType" onChange={handleChange}>
                <option value="Homicide volontaire">Homicide volontaire (Meurtre)</option>
                <option value="Homicide involontaire">Homicide involontaire</option>
                <option value="Assassinat">Assassinat (Prémédité)</option>
                <option value="Coups et blessures mortels">Coups et blessures mortels ayant entraîné la mort</option>
              </Select>
            </div>
            
            <Input label="Date de découverte" name="discoveryDate" type="date" onChange={handleChange} required />
            <Input label="Heure approximative" name="discoveryTime" type="time" onChange={handleChange} />
            <Input label="Ville / Commune" name="locationCity" onChange={handleChange} required />
            
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
               <Input label="Quartier / Zone" name="locationDistrict" onChange={handleChange} />
               <Input label="Adresse précise (ou Point GPS)" name="preciseAddress" onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* SECTION 2 : LA VICTIME */}
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                 <UserX size={20} />
              </span>
              Identité de la Victime
            </h3>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center relative group-hover:border-slate-500 transition-colors shadow-inner">
                {previews.victim ? <img src={previews.victim} className="w-full h-full object-cover grayscale" /> : <Camera size={32} className="text-slate-300" />}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'victim')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Photo (Visage/Signe distinctif)</p>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                 <Input label="Nom (Patronyme)" name="victimLastName" onChange={handleChange} placeholder="Inconnu si non identifié" />
                 <Input label="Prénoms" name="victimFirstName" onChange={handleChange} />
              </div>
              
              <Input label="N° National (NNI)" name="victimNNI" placeholder="Si retrouvé sur le corps" onChange={handleChange} />
              
              <div className="grid grid-cols-2 gap-4">
                 <Select label="Sexe Apparent" name="victimGender" onChange={handleChange}>
                   <option value="">Sélectionner</option>
                   <option value="M">Masculin</option>
                   <option value="F">Féminin</option>
                   <option value="Non_Identifiable">Non Identifiable</option>
                 </Select>
                 <Input label="Âge Estimé" name="estimatedAge" type="number" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 3 : ANALYSE SCIENTIFIQUE (Dark Mode) */}
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
               <Fingerprint size={250} />
            </div>
            
            <div>
              <h3 className="text-xs font-black text-red-500 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
                <Crosshair size={18} /> Police Scientifique & Arme
              </h3>
              
              <div className="space-y-6 relative z-10">
                <SelectDark label="Moyen / Arme utilisé (Présumé)" name="weaponType" onChange={handleChange}>
                  <option value="Arme à feu">Arme à feu</option>
                  <option value="Arme blanche">Arme blanche</option>
                  <option value="Objet contondant">Objet contondant</option>
                  <option value="Étranglement">Étranglement / Suffocation</option>
                  <option value="Empoisonnement">Empoisonnement</option>
                </SelectDark>
                
                <InputDark label="Précisions sur l'arme / les blessures" name="weaponDetail" placeholder="Ex: Douilles 9mm, plaie par arme blanche au thorax..." onChange={handleChange} />
                
                <div className="mt-8 pt-8 border-t border-slate-800">
                  <LabelDark>Photo de la scène de crime (Classifié)</LabelDark>
                  <div className="w-full h-32 mt-2 rounded-[2rem] bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center relative hover:border-red-500 transition-colors cursor-pointer overflow-hidden shadow-inner">
                    {previews.scene ? (
                      <img src={previews.scene} className="w-full h-full object-cover opacity-60" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera size={24} className="text-slate-500 mb-2" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uploader la preuve</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileChange(e, 'scene')} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4 : PROCÉDURE & OFFICIERS */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
               <BookOpen size={16} />
            </span>
            Habilitations & Saisine du Parquet
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input label="Unité d'Enquête" name="investigatingUnit" placeholder="Ex: Direction Police Criminelle (DPC)" onChange={handleChange} required />
            <Input label="Officier de Police Judiciaire (OPJ)" name="officerInCharge" onChange={handleChange} required />
            <Input label="Matricule de l'OPJ" name="officerMatricule" onChange={handleChange} required />
            <Input label="Réf. Saisine du Parquet" name="procureurReferral" placeholder="Ex: PARQ-2026-ABJ-09" onChange={handleChange} />
            
            <div className="lg:col-span-4 mt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Observations initiales de l'Enquêteur</label>
              <textarea 
                name="crimeSceneObservations" 
                rows={4} 
                className="w-full p-6 bg-slate-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all text-sm font-bold placeholder-slate-300 shadow-inner"
                onChange={handleChange}
                placeholder="Rédigez les premières constatations faites sur les lieux (position du corps, traces d'effraction...)"
              ></textarea>
            </div>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-3/4 py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/40 uppercase tracking-[0.3em] text-sm hover:bg-black hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            <ShieldAlert size={20} className={loading ? "animate-spin" : ""} />
            {loading ? "SÉCURISATION DU DOSSIER..." : "SCELLER ET TRANSMETTRE AU PROCUREUR"}
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
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500 transition-all"
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

export default HomicideForm;