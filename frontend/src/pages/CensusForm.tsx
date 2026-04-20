// src/pages/CensusForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { User, Users, Plus, Trash2, Wifi, Zap, Droplet, Utensils, HeartPulse, Wallet } from "lucide-react";

type CensusMode = "INDIVIDUEL" | "FAMILLE";

const CensusForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<CensusMode>("INDIVIDUEL");

  const [formData, setFormData] = useState({
    lastName: "",   // Nom
    firstName: "",  // Prénoms
    age: "",        // Âge
    nni: "",
    birthDate: "",
    gender: "",
    profession: "",
    region: "",
    city: "",
    address: "",
    // --- CHAMPS IDH ---
    electricityType: "Aucun",
    waterSource: "Autre",
    internetAccess: "Aucun",
    dailyMeals: "3",
    healthAccess: "Difficile",
    averageIncome: "",
  });

  const [familyMembers, setFamilyMembers] = useState([
    { lastName: "", firstName: "", age: "", relation: "Enfant", gender: "", birthDate: "" }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFamilyMembers(updatedMembers);
  };

  const addMember = () => {
    setFamilyMembers([...familyMembers, { lastName: "", firstName: "", age: "", relation: "Enfant", gender: "", birthDate: "" }]);
  };

  const removeMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        censusType: mode,
        members: mode === "FAMILLE" ? familyMembers : [],
        totalHouseholdSize: mode === "FAMILLE" ? familyMembers.length + 1 : 1,
        status: "RECENSÉ",
      };

      await apiService.post('/citizens', payload);
      toast.success(`Enrôlement ${mode.toLowerCase()} validé et synchronisé !`);
    } catch (error) {
      toast.error("Erreur de sauvegarde système.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Recensement Démographique</h2>
          <p className="text-orange-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Institut National de la Statistique • RGPH</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
          Saisie en cours
        </div>
      </div>

      {/* TOGGLE PREMIUM */}
      <div className="flex justify-center mb-12">
        <div className="bg-white p-2 rounded-[2.5rem] flex gap-2 shadow-lg shadow-slate-200/50 border border-slate-100 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setMode("INDIVIDUEL")}
            className={`flex-1 md:flex-none px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${mode === "INDIVIDUEL" ? "bg-orange-600 text-white shadow-xl shadow-orange-900/20 scale-100" : "text-slate-500 hover:bg-slate-50 scale-95"}`}
          >
            <User size={18} /> Individu
          </button>
          <button 
            type="button"
            onClick={() => setMode("FAMILLE")}
            className={`flex-1 md:flex-none px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 ${mode === "FAMILLE" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-100" : "text-slate-500 hover:bg-slate-50 scale-95"}`}
          >
            <Users size={18} /> Ménage
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1 : CHEF DE MÉNAGE */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
          <h3 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">1</span>
            {mode === "FAMILLE" ? "Chef de Ménage" : "Identité du Citoyen"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <Input label="Nom (Patronyme)" name="lastName" onChange={handleChange} required />
            <Input label="Prénoms" name="firstName" onChange={handleChange} required />
            <Input label="Âge" name="age" type="number" onChange={handleChange} required />
            
            <Input label="Date de Naissance" name="birthDate" type="date" onChange={handleChange} />
            <Input label="NNI (Numéro National)" name="nni" onChange={handleChange} required />
            <Select label="Sexe" name="gender" onChange={handleChange} required>
              <option value="">Sélectionner</option><option value="M">Masculin</option><option value="F">Féminin</option>
            </Select>
            
            <Input label="Profession / Activité" name="profession" onChange={handleChange} />
            <Input label="Ville / Commune" name="city" onChange={handleChange} required />
            <Input label="Adresse précise" name="address" onChange={handleChange} required />
          </div>
        </div>

        {/* SECTION 2 : MEMBRES (FAMILLE) */}
        {mode === "FAMILLE" && (
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200">
            <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">2</span>
                Membres du Ménage
              </h3>
              <span className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-[10px] font-black shadow-sm">
                Total : {familyMembers.length + 1} personne(s)
              </span>
            </div>

            <div className="space-y-6">
              {familyMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-6 transition-all hover:border-orange-300 hover:shadow-lg hover:shadow-orange-900/5">
                  
                  {/* Grille interne pour chaque membre (2 lignes) */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom</label>
                        <input type="text" className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.lastName} onChange={(e) => handleMemberChange(index, "lastName", e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Prénoms</label>
                        <input type="text" className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.firstName} onChange={(e) => handleMemberChange(index, "firstName", e.target.value)} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Âge</label>
                        <input type="number" className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.age} onChange={(e) => handleMemberChange(index, "age", e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Naissance</label>
                        <input type="date" className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.birthDate} onChange={(e) => handleMemberChange(index, "birthDate", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Sexe</label>
                        <select className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.gender} onChange={(e) => handleMemberChange(index, "gender", e.target.value)} required>
                          <option value="">Sexe</option><option value="M">M</option><option value="F">F</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lien</label>
                        <select className="w-full p-4 bg-slate-50 focus:bg-white border border-transparent focus:border-orange-200 rounded-2xl outline-none font-bold text-sm transition-colors" value={member.relation} onChange={(e) => handleMemberChange(index, "relation", e.target.value)} required>
                          <option value="Conjoint(e)">Conjoint(e)</option><option value="Enfant">Enfant</option><option value="Parent">Parent</option><option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Supprimer */}
                  <button type="button" onClick={() => removeMember(index)} className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors shrink-0">
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addMember} className="mt-8 flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
              <Plus size={16} /> Ajouter une personne
            </button>
          </div>
        )}

        {/* SECTION 3 : CONDITIONS DE VIE & IDH */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none">
             <Zap size={300} />
          </div>
          
          <h3 className="text-xs font-black text-orange-400 mb-10 uppercase tracking-widest flex items-center gap-3 relative z-10">
            <span className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">{mode === "FAMILLE" ? "3" : "2"}</span>
            Analyse Multidimensionnelle (IDH)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            <SelectIcon icon={<Zap size={16}/>} label="Électricité" name="electricityType" onChange={handleChange}>
              <option value="Aucun">Pas d'accès</option>
              <option value="CIE Prepaye">CIE - Prépayé</option>
              <option value="CIE Postpaye">CIE - Postpayé</option>
              <option value="Solaire">Panneaux Solaires</option>
            </SelectIcon>
            
            <SelectIcon icon={<Droplet size={16}/>} label="Eau Potable" name="waterSource" onChange={handleChange}>
              <option value="Autre">Non Potable / Marigot</option>
              <option value="SODECI">Réseau SODECI</option>
              <option value="Puits">Puits / Forage aménagé</option>
              <option value="Fontaine">Fontaine Publique</option>
            </SelectIcon>

            <SelectIcon icon={<Wifi size={16}/>} label="Accès Internet" name="internetAccess" onChange={handleChange}>
              <option value="Aucun">Aucun accès</option>
              <option value="Mobile">Mobile (Data 3G/4G)</option>
              <option value="Fibre">Fibre Optique / Box</option>
              <option value="Cyber">Cybercafé</option>
            </SelectIcon>

            <SelectIcon icon={<Utensils size={16}/>} label="Repas par jour" name="dailyMeals" onChange={handleChange}>
              <option value="1">1 Repas</option>
              <option value="2">2 Repas</option>
              <option value="3">3 Repas ou plus</option>
            </SelectIcon>

            <SelectIcon icon={<HeartPulse size={16}/>} label="Accès aux Soins" name="healthAccess" onChange={handleChange}>
              <option value="Difficile">Difficile / Trop cher</option>
              <option value="Centre Sante">Centre de Santé Public proche</option>
              <option value="Clinique">Clinique Privée</option>
            </SelectIcon>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                <Wallet size={16} /> Revenu Mensuel Moyen (FCFA)
              </label>
              <input 
                type="number" 
                name="averageIncome" 
                placeholder="Ex: 150000" 
                onChange={handleChange} 
                className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-orange-500 placeholder-slate-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* BOUTON VALIDATION */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-orange-600 text-white font-black rounded-[2rem] shadow-2xl shadow-orange-900/30 uppercase tracking-[0.3em] text-sm hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? "TRANSMISSION SÉCURISÉE..." : `VALIDER LE DOSSIER DU ${mode === "FAMILLE" ? "MÉNAGE" : "CITOYEN"}`}
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
    <input {...props} className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none transition-all text-sm font-bold placeholder-slate-300 focus:bg-white focus:border-orange-200 focus:shadow-md ${className}`} />
  </div>
);

const Select = ({ label, children, className = "", ...props }: any) => (
  <div>
    {label && <Label className={className.includes('text-white') ? 'text-slate-500' : ''}>{label}</Label>}
    <select {...props} className={`w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none font-bold text-sm text-slate-700 focus:bg-white focus:border-orange-200 focus:shadow-md ${className}`}>
      {children}
    </select>
  </div>
);

const SelectIcon = ({ label, icon, children, ...props }: any) => (
  <div>
    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">
      {icon} {label}
    </label>
    <select {...props} className="w-full p-4 bg-slate-800 border-none rounded-2xl outline-none font-bold text-sm text-white focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer">
      {children}
    </select>
  </div>
);

export default CensusForm;