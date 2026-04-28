// Module 11 — Naissance hors établissement
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { Baby, MapPin, Users, Save, Cpu, AlertTriangle } from "lucide-react";

const CIRCUMSTANCES = ["Domicile", "Champ / Plantation", "Route / Véhicule", "Marché", "Autre lieu public"];

const OutOfFacilityBirthForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    babyFirstName: "", babyLastName: "", gender: "MASCULIN",
    birthDate: "", birthPlace: "", birthCircumstance: "Domicile",
    motherFullName: "", motherNni: "",
    fatherFullName: "", fatherNni: "",
    declarantName: "", declarantRelation: "Père",
    witness1Name: "", witness1Nni: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/modules/out-of-facility-birth', {
        ...formData,
        witnesses: [{ name: formData.witness1Name, nni: formData.witness1Nni }],
      });
      toast.success("Naissance hors établissement enregistrée !");
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 pb-20">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Naissance Hors Établissement</h2>
          <p className="text-orange-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Déclaration de naissance — Domicile / Terrain / Route</p>
        </div>
        <div className="bg-orange-50 text-orange-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100 flex items-center gap-2">
          <AlertTriangle size={16} /> Cas Spécial
        </div>
      </div>

      <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 font-bold">Ce formulaire est réservé aux naissances survenues en dehors d'un établissement de santé. Un agent doit se rendre sur place pour vérification dans les 72h.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nouveau-né */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-orange-600 mb-6 uppercase tracking-widest flex items-center gap-2"><Baby size={16} /> Identité du Nouveau-né</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Prénom(s)" name="babyFirstName" onChange={handleChange} required />
            <Field label="Nom de famille" name="babyLastName" onChange={handleChange} required />
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Sexe</label>
              <select name="gender" onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold">
                <option value="MASCULIN">Masculin</option>
                <option value="FEMININ">Féminin</option>
              </select>
            </div>
            <Field label="Date de naissance" name="birthDate" type="date" onChange={handleChange} required />
          </div>
        </div>

        {/* Lieu */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl space-y-5">
          <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={16} /> Lieu & Circonstances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldDark label="Lieu précis (village, quartier, route...)" name="birthPlace" onChange={handleChange} required />
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Circonstances</label>
              <select name="birthCircumstance" onChange={handleChange} className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none">
                {CIRCUMSTANCES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Parents & Déclarant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> Parents</h3>
            <Field label="Nom complet de la mère" name="motherFullName" onChange={handleChange} required />
            <Field label="NNI de la mère" name="motherNni" onChange={handleChange} />
            <Field label="Nom complet du père" name="fatherFullName" onChange={handleChange} />
            <Field label="NNI du père" name="fatherNni" onChange={handleChange} />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Déclarant & Témoin</h3>
            <Field label="Nom du déclarant" name="declarantName" onChange={handleChange} required />
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">Lien avec l'enfant</label>
              <select name="declarantRelation" onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold">
                {["Père", "Mère", "Grand-parent", "Voisin", "Agent de santé", "Autre"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <Field label="Nom du témoin" name="witness1Name" onChange={handleChange} />
            <Field label="NNI du témoin" name="witness1Nni" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-[2rem] uppercase tracking-[0.3em] text-sm shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
          {loading ? <><Cpu size={20} className="animate-spin" /> Enregistrement...</> : <><Save size={20} /> Enregistrer la Naissance</>}
        </button>
      </form>
    </div>
  );
};

const Field = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">{label}</label>
    <input {...props} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-orange-400 transition-all" />
  </div>
);

const FieldDark = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">{label}</label>
    <input {...props} className="w-full p-4 bg-slate-800 rounded-2xl outline-none text-sm font-bold text-white focus:ring-2 focus:ring-orange-500 transition-all placeholder-slate-600" />
  </div>
);

export default OutOfFacilityBirthForm;
