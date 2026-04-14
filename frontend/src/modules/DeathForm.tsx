// src/modules/DeathForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { Skull, FileText, UserMinus, UserCheck, Stethoscope, MapPin, UploadCloud } from "lucide-react";

const DeathForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [certPreview, setCertPreview] = useState("");

  const [formData, setFormData] = useState({
    // --- IDENTITÉ DU DÉFUNT ---
    deceasedLastName: "",
    deceasedFirstName: "",
    deceasedAge: "",
    deceasedNNI: "",
    deceasedGender: "",
    deceasedBirthDate: "", // Gardé optionnel si l'âge est saisi
    deceasedProfession: "",
    
    // --- CIRCONSTANCES DU DÉCÈS ---
    deathDate: "",
    deathTime: "",
    deathPlace: "", // Hôpital, Domicile, Voie Publique
    deathCity: "",
    causeOfDeath: "", 
    
    // --- LE DÉCLARANT ---
    informantLastName: "",
    informantFirstName: "",
    informantNNI: "",
    informantRelation: "", 
    informantPhone: "",

    medicalCertNumber: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCertPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certPreview) return toast.error("Le certificat médical est obligatoire pour sceller l'acte.");

    setLoading(true);
    try {
      await apiService.post('/events/death', {
        ...formData,
        medicalCertificateImage: certPreview,
        status: "A_VALIDER",
      });
      
      toast.success("Acte de décès enregistré au registre national.");
      // Optionnel: Reset form
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Registre des Décès</h2>
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Système National de Sécurisation d'État Civil</p>
        </div>
        <div className="bg-slate-100 text-slate-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-slate-200 flex items-center gap-2 shadow-sm">
          <FileText size={16} /> Acte Légal
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : LE DÉFUNT */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          
          <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner">
              <UserMinus size={20} />
            </span>
            Identité du Défunt
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            <div className="md:col-span-2"><Input label="Nom (Patronyme)" name="deceasedLastName" onChange={handleChange} required /></div>
            <div className="md:col-span-2"><Input label="Prénoms" name="deceasedFirstName" onChange={handleChange} required /></div>
            
            <Input label="Âge" name="deceasedAge" type="number" onChange={handleChange} required />
            <Select label="Sexe" name="deceasedGender" onChange={handleChange} required>
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </Select>
            <Input label="Date de Naissance (Si connue)" name="deceasedBirthDate" type="date" onChange={handleChange} />
            <Input label="N° National (NNI)" name="deceasedNNI" onChange={handleChange} required />
            
            <div className="md:col-span-4"><Input label="Dernière Profession / Activité" name="deceasedProfession" onChange={handleChange} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* SECTION 2 : CIRCONSTANCES */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-indigo-600 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                 <MapPin size={20} />
              </span>
              Circonstances du Décès
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <Input label="Date du Décès" name="deathDate" type="date" onChange={handleChange} required />
              <Input label="Heure approximative" name="deathTime" type="time" onChange={handleChange} />
              
              <Select label="Lieu du Constat" name="deathPlace" onChange={handleChange} required>
                <option value="">Sélectionner le lieu</option>
                <option value="Hôpital">Hôpital / Clinique / CHU</option>
                <option value="Domicile">Domicile familial</option>
                <option value="Voie Publique">Voie Publique (Accident/Autre)</option>
                <option value="Autre">Autre</option>
              </Select>
              <Input label="Ville / Commune" name="deathCity" onChange={handleChange} required />
              
              <div className="md:col-span-2">
                <Label>Cause du Décès (Si connue)</Label>
                <div className="mt-1">
                  <textarea 
                    name="causeOfDeath" 
                    rows={2} 
                    className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-bold placeholder-slate-300" 
                    placeholder="Ex: Maladie, arrêt cardiaque, accident de la route..."
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3 : CERTIFICAT MÉDICAL (UPLOAD) */}
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
               <Stethoscope size={200} />
            </div>
            
            <div>
              <h3 className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-widest flex items-center gap-3 relative z-10">
                <Stethoscope size={18} /> Acte Médical
              </h3>
              
              <div className="mb-6 relative z-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">N° Certificat de Décès</label>
                <input 
                  name="medicalCertNumber" 
                  onChange={handleChange} 
                  placeholder="Ex: CERT-2026-ABJ" 
                  className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white font-bold placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col items-center relative z-10">
              <div className="w-full h-40 rounded-[2rem] bg-slate-800 border-2 border-dashed border-slate-600 overflow-hidden flex flex-col items-center justify-center relative group hover:border-indigo-400 transition-colors cursor-pointer">
                {certPreview ? (
                  <img src={certPreview} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <>
                    <UploadCloud size={32} className="text-slate-400 mb-2 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-300">Scan du Document</span>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
              </div>
              <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-[0.2em] text-center">Toute fausse déclaration est punie par la loi.</p>
            </div>
          </div>
        </div>

        {/* SECTION 4 : LE DÉCLARANT & VALIDATION */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-10 items-center relative overflow-hidden group">
          
          <div className="flex-1 w-full relative z-10">
            <h3 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                 <UserCheck size={16} />
              </span>
              Identité du Déclarant
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nom (Patronyme)" name="informantLastName" onChange={handleChange} required />
              <Input label="Prénoms" name="informantFirstName" onChange={handleChange} required />
              <Input label="N° National (NNI)" name="informantNNI" onChange={handleChange} required />
              <Input label="Téléphone" name="informantPhone" onChange={handleChange} required />
              <div className="md:col-span-2">
                <Input label="Lien avec le défunt (Fils, Épouse...)" name="informantRelation" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 relative z-10 lg:pl-10 lg:border-l border-slate-100 flex items-center">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full lg:w-auto px-12 py-8 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/30 uppercase tracking-[0.2em] text-sm hover:bg-black hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
            >
              {loading ? "TRAITEMENT EN COURS..." : "SCELLER L'ACTE DE DÉCÈS"}
            </button>
          </div>
          
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
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-slate-300 focus:shadow-md ${className}`} 
    />
  </div>
);

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label className={className.includes('text-white') ? 'text-slate-500' : ''}>{label}</Label>}
    <select 
      {...props} 
      className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-slate-300 focus:shadow-md ${className}`}
    >
      {children}
    </select>
  </div>
);

export default DeathForm;