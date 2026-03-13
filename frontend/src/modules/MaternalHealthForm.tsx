// src/modules/MaternalHealthForm.tsx
import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { HeartPulse, UserRound, Activity, Stethoscope, Baby, FileText, AlertCircle } from "lucide-react";

const MaternalHealthForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // --- IDENTITÉ DE LA MÈRE ---
    motherLastName: "",
    motherFirstName: "",
    motherNNI: "",
    motherAge: "",
    residenceCity: "",
    
    // --- HISTORIQUE MÉDICAL ---
    pregnancyCount: "1", // Gestité
    birthCount: "0",     // Parité
    prenatalFollowup: "Oui", // Suivi prénatal (CPN)
    
    // --- L'INCIDENT ---
    incidentDate: "",
    incidentTime: "",
    incidentPlace: "Centre de Santé", 
    facilityName: "", 
    
    // --- CAUSES CLINIQUES ---
    primaryCause: "Hémorragie post-partum", 
    otherComplications: "",
    
    // --- ÉTAT DU NOUVEAU-NÉ ---
    newbornStatus: "Vivant", 
    
    // --- VALIDATION MÉDICALE ---
    attendingStaff: "", 
    staffMatricule: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "maternal_health"), {
        ...formData,
        registeredAt: serverTimestamp(),
        category: "MORTALITÉ_MATERNELLE",
      });
      toast.success("Rapport clinique sanitaire enregistré avec succès.");
      // Optionnel : Reset du formulaire
    } catch (error) {
      toast.error("Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Santé Maternelle & Infantile</h2>
          <p className="text-emerald-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Observatoire National • Ministère de la Santé CI</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 shadow-sm">
          <HeartPulse size={16} className="animate-pulse" /> Rapport Clinique
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : PATIENTE & HISTORIQUE */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <UserRound size={20} />
            </span>
            Identification & Historique de la Patiente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-2"><Input label="Nom (Patronyme)" name="motherLastName" onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Input label="Prénoms" name="motherFirstName" onChange={handleChange} required /></div>
            
            <Input label="Âge" name="motherAge" type="number" onChange={handleChange} required />
            <Input label="N° National (NNI)" name="motherNNI" onChange={handleChange} required />
            <div className="md:col-span-2"><Input label="Ville / Commune de résidence" name="residenceCity" onChange={handleChange} required /></div>

            {/* Historique Médical (Nouveau) */}
            <div className="lg:col-span-4 mt-4 pt-6 border-t border-slate-100">
              <h4 className="text-[10px] font-black text-emerald-600 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={14} /> Antécédents Obstétricaux
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Select label="Suivi Prénatal (CPN)" name="prenatalFollowup" onChange={handleChange}>
                  <option value="Oui">Oui (Dossier complet)</option>
                  <option value="Partiel">Partiel (1 à 3 visites)</option>
                  <option value="Non">Aucun suivi CPN</option>
                </Select>
                <Input label="Gestité (Nbre de grossesses)" name="pregnancyCount" type="number" onChange={handleChange} required />
                <Input label="Parité (Nbre d'accouchements)" name="birthCount" type="number" onChange={handleChange} required />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 : CIRCONSTANCES & CAUSES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Clinique (Dark Mode) */}
          <div className="lg:col-span-2 bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 opacity-5 pointer-events-none">
               <Stethoscope size={250} />
            </div>

            <h3 className="text-xs font-black text-emerald-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <AlertCircle size={18} /> Détails Cliniques de l'Incident
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <SelectDark label="Cause du décès / Complication majeure" name="primaryCause" onChange={handleChange}>
                <option value="Hémorragie post-partum">Hémorragie post-partum</option>
                <option value="Éclampsie / Hypertension">Éclampsie / Hypertension prééclampsie</option>
                <option value="Infection / Sepsis">Infection puerpérale / Sepsis</option>
                <option value="Complication d'avortement">Complication d'avortement</option>
                <option value="Travail obstrué">Travail prolongé / obstrué</option>
                <option value="Embolie">Embolie amniotique</option>
                <option value="Autre cause indirecte">Autre cause indirecte (Paludisme, Anémie...)</option>
              </SelectDark>
              
              <SelectDark label="Lieu de survenue" name="incidentPlace" onChange={handleChange}>
                <option value="Centre de Santé">Établissement de Santé (Public)</option>
                <option value="Clinique Privée">Clinique Privée</option>
                <option value="Domicile">Domicile familial</option>
                <option value="Transit">En cours de transfert (Ambulance/Taxi)</option>
              </SelectDark>

              <InputDark label="Date de l'incident" name="incidentDate" type="date" onChange={handleChange} required />
              <InputDark label="Heure" name="incidentTime" type="time" onChange={handleChange} required />
              
              <div className="md:col-span-2">
                <InputDark label="Nom de l'établissement (Si applicable)" name="facilityName" placeholder="Ex: CHU de Treichville, Maternité de Yopougon" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* État du Nouveau-né */}
          <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-center shadow-inner relative overflow-hidden group">
            <div className="absolute -right-5 top-5 opacity-10 group-hover:scale-110 transition-transform">
              <Baby size={150} />
            </div>

            <h3 className="text-xs font-black text-emerald-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
               <Baby size={16} /> État du Nouveau-né
            </h3>

            <div className="space-y-4 relative z-10">
               <label className={`w-full p-5 rounded-[2rem] flex items-center gap-4 cursor-pointer transition-all ${formData.newbornStatus === 'Vivant' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : 'bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-400'}`}>
                  <input type="radio" name="newbornStatus" value="Vivant" className="hidden" onChange={handleChange} checked={formData.newbornStatus === 'Vivant'} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.newbornStatus === 'Vivant' ? 'border-white' : 'border-emerald-300'}`}>
                    {formData.newbornStatus === 'Vivant' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">Vivant</span>
               </label>

               <label className={`w-full p-5 rounded-[2rem] flex items-center gap-4 cursor-pointer transition-all ${formData.newbornStatus === 'Décédé' ? 'bg-red-600 text-white shadow-xl shadow-red-900/20' : 'bg-white text-red-700 border border-red-200 hover:border-red-400'}`}>
                  <input type="radio" name="newbornStatus" value="Décédé" className="hidden" onChange={handleChange} checked={formData.newbornStatus === 'Décédé'} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.newbornStatus === 'Décédé' ? 'border-white' : 'border-red-300'}`}>
                    {formData.newbornStatus === 'Décédé' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">Mort-né / Décédé</span>
               </label>
            </div>
          </div>
        </div>

        {/* SECTION 3 : STAFF MÉDICAL */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
               <FileText size={16} />
            </span>
            Validation Médicale & Observations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><Input label="Praticien Responsable (Médecin / Sage-femme)" name="attendingStaff" placeholder="Nom complet" onChange={handleChange} required /></div>
            <Input label="Matricule Professionnel" name="staffMatricule" placeholder="N° d'Ordre" onChange={handleChange} required />
            
            <div className="lg:col-span-3 mt-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Observations cliniques additionnelles</label>
              <textarea 
                name="otherComplications" 
                rows={4} 
                className="w-full p-6 bg-slate-50 border border-transparent rounded-[2rem] outline-none focus:bg-white focus:border-emerald-200 focus:ring-2 focus:ring-emerald-50 transition-all text-sm font-bold placeholder-slate-300 shadow-inner"
                onChange={handleChange}
                placeholder="Précisez les circonstances aggravantes, retard de prise en charge, manque de sang..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6 flex justify-center">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-3/4 py-6 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black rounded-[2rem] shadow-2xl shadow-emerald-900/30 uppercase tracking-[0.3em] text-sm hover:from-emerald-700 hover:to-teal-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? "TRANSMISSION SECÉCURISÉE..." : "ENREGISTRER LE RAPPORT SANITAIRE"}
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
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-emerald-200 focus:shadow-md ${className}`} 
    />
  </div>
);

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label>{label}</Label>}
    <select 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-emerald-200 focus:shadow-md ${className}`}
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
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 transition-all"
    />
  </div>
);

const SelectDark = ({ label, children, ...props }: any) => (
  <div>
    {label && <LabelDark>{label}</LabelDark>}
    <select 
      {...props} 
      className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
    >
      {children}
    </select>
  </div>
);

export default MaternalHealthForm;