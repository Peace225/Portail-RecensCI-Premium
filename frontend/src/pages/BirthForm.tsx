// src/modules/BirthForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";

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
      await apiService.post('/events/birth', {
        ...formData,
        motherPhoto: previews.mother,
        fatherPhoto: previews.father,
        status: "EN_ATTENTE_VALIDATION",
      });
      
      toast.success("Naissance déclarée avec les photos des parents !");
      // Optionnel: Reset du formulaire
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Registre des Naissances</h2>
        <p className="text-orange-600 font-bold tracking-widest text-sm mt-1">SYSTÈME NATIONAL DE SÉCURISATION D'ÉTAT CIVIL</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : LE NOUVEAU-NÉ */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <span className="bg-orange-100 p-3 rounded-2xl">👶</span> Nouveau-né
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2"><Label>Prénoms</Label><Input name="babyFirstName" onChange={handleChange} required /></div>
            <div><Label>Nom de famille</Label><Input name="babyLastName" onChange={handleChange} required /></div>
            <div>
              <Label>Sexe</Label>
              <select name="gender" className="form-select" onChange={handleChange} required>
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div><Label>Date de naissance</Label><Input name="birthDate" type="date" onChange={handleChange} required /></div>
            <div><Label>Heure de naissance</Label><Input name="birthTime" type="time" onChange={handleChange} required /></div>
            <div><Label>Poids (kg)</Label><Input name="weight" type="number" step="0.01" onChange={handleChange} /></div>
            <div><Label>Taille (cm)</Label><Input name="height" type="number" onChange={handleChange} /></div>
            <div className="md:col-span-2"><Label>Lieu / Hôpital</Label><Input name="hospitalName" onChange={handleChange} required /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* SECTION 2 : LA MÈRE */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 rounded-bl-[4rem] -z-0 opacity-50"></div>
            <h3 className="text-xl font-bold text-pink-600 mb-8 flex items-center gap-3 relative z-10">
              <span className="bg-pink-100 p-3 rounded-2xl">👩‍🍼</span> La Mère
            </h3>
            
            <div className="flex flex-col items-center mb-8">
              <div className="w-28 h-28 rounded-2xl bg-slate-100 border-2 border-dashed border-pink-200 overflow-hidden flex items-center justify-center relative group">
                {previews.mother ? <img src={previews.mother} className="w-full h-full object-cover" /> : <span className="text-4xl">📷</span>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'mother')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-pink-400 mt-2 uppercase">Photo d'identité Mère</p>
            </div>

            <div className="space-y-5 relative z-10">
              <Input name="motherFullName" placeholder="Nom complet" onChange={handleChange} required />
              <Input name="motherNNI" placeholder="N° National d'Identité (NNI)" onChange={handleChange} required />
              <Input name="motherProfession" placeholder="Profession" onChange={handleChange} />
              <select name="motherMaritalStatus" className="form-select" onChange={handleChange}>
                <option value="Celibataire">Célibataire</option>
                <option value="Mariee">Mariée</option>
                <option value="Divorcee">Divorcée / Veuve</option>
              </select>
              <Input name="motherLocation" placeholder="Lieu de résidence" onChange={handleChange} />
            </div>
          </div>

          {/* SECTION 3 : LE PÈRE */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[4rem] -z-0 opacity-50"></div>
            <h3 className="text-xl font-bold text-blue-600 mb-8 flex items-center gap-3 relative z-10">
              <span className="bg-blue-100 p-3 rounded-2xl">👨‍🍼</span> Le Père
            </h3>

            <div className="flex flex-col items-center mb-8">
              <div className="w-28 h-28 rounded-2xl bg-slate-100 border-2 border-dashed border-blue-200 overflow-hidden flex items-center justify-center relative group">
                {previews.father ? <img src={previews.father} className="w-full h-full object-cover" /> : <span className="text-4xl">📷</span>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileChange(e, 'father')} accept="image/*" />
              </div>
              <p className="text-[10px] font-black text-blue-400 mt-2 uppercase">Photo d'identité Père</p>
            </div>

            <div className="space-y-5 relative z-10">
              <Input name="fatherFullName" placeholder="Nom complet" onChange={handleChange} />
              <Input name="fatherNNI" placeholder="N° National d'Identité (NNI)" onChange={handleChange} />
              <Input name="fatherProfession" placeholder="Profession" onChange={handleChange} />
              <select name="fatherMaritalStatus" className="form-select" onChange={handleChange}>
                <option value="Celibataire">Célibataire</option>
                <option value="Mariee">Mariée</option>
                <option value="Divorcee">Divorcée / Veuve</option>
              </select>
              <Input name="fatherLocation" placeholder="Lieu de résidence" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* SECTION BASSE : VALIDATION */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <Label className="text-slate-500">Praticien Accoucheur</Label>
            <input 
              name="doctorName" 
              className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-orange-500 transition-all" 
              placeholder="Nom du Médecin ou de la Sage-femme" 
              onChange={handleChange} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-16 h-16 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/40 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? "TRAITEMENT..." : "ENREGISTRER L'ACTE"}
          </button>
        </div>
      </form>
    </div>
  );
};

// HELPERS UI
const Label = ({ children, className = "" }: any) => (
  <label className={`block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ${className}`}>
    {children}
  </label>
);

const Input = (props: any) => (
  <input 
    {...props} 
    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all text-slate-700 font-bold placeholder-slate-300"
  />
);

export default BirthForm;