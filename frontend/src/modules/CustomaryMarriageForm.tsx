// Module 5 — Mariage Coutumier
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";
import { HeartHandshake, Users, MapPin, Crown, Save, Cpu } from "lucide-react";

const CustomaryMarriageForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    spouse1Name: "", spouse1Nni: "", spouse1Village: "",
    spouse2Name: "", spouse2Nni: "", spouse2Village: "",
    marriageDate: "", ceremonyPlace: "",
    customaryChief: "", dotDescription: "",
    witness1Name: "", witness1Nni: "",
    witness2Name: "", witness2Nni: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/modules/customary-marriage', {
        ...formData,
        witnesses: [
          { name: formData.witness1Name, nni: formData.witness1Nni },
          { name: formData.witness2Name, nni: formData.witness2Nni },
        ],
      });
      toast.success("Mariage coutumier enregistré au registre civil !");
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Mariage Coutumier</h2>
          <p className="text-amber-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Enregistrement d'Union Traditionnelle • Côte d'Ivoire</p>
        </div>
        <div className="bg-amber-50 text-amber-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 flex items-center gap-2">
          <Crown size={16} /> Droit Coutumier
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Époux & Épouse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="L'Époux" color="blue">
            <Field label="Nom complet" name="spouse1Name" onChange={handleChange} required />
            <Field label="NNI" name="spouse1Nni" onChange={handleChange} />
            <Field label="Village / Quartier d'origine" name="spouse1Village" onChange={handleChange} />
          </Section>
          <Section title="L'Épouse" color="pink">
            <Field label="Nom complet" name="spouse2Name" onChange={handleChange} required />
            <Field label="NNI" name="spouse2Nni" onChange={handleChange} />
            <Field label="Village / Quartier d'origine" name="spouse2Village" onChange={handleChange} />
          </Section>
        </div>

        {/* Cérémonie */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl space-y-6">
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={16} /> Détails de la Cérémonie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldDark label="Date de la cérémonie" name="marriageDate" type="date" onChange={handleChange} required />
            <FieldDark label="Lieu de la cérémonie" name="ceremonyPlace" placeholder="Village, quartier..." onChange={handleChange} required />
            <FieldDark label="Chef coutumier officiant" name="customaryChief" placeholder="Nom du chef" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Description de la dot</label>
            <textarea name="dotDescription" rows={3} onChange={handleChange}
              className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Biens, animaux, montant symbolique..." />
          </div>
        </div>

        {/* Témoins */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Users size={16} /> Témoins de la Cérémonie
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">1er Témoin</p>
              <Field label="Nom complet" name="witness1Name" onChange={handleChange} />
              <Field label="NNI" name="witness1Nni" onChange={handleChange} />
            </div>
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">2ème Témoin</p>
              <Field label="Nom complet" name="witness2Name" onChange={handleChange} />
              <Field label="NNI" name="witness2Nni" onChange={handleChange} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-[2rem] uppercase tracking-[0.3em] text-sm shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
          {loading ? <><Cpu size={20} className="animate-spin" /> Enregistrement...</> : <><Save size={20} /> Sceller l'Acte Coutumier</>}
        </button>
      </form>
    </div>
  );
};

const Section = ({ title, color, children }: any) => (
  <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100`}>
    <h3 className={`text-xs font-black text-${color}-600 mb-6 uppercase tracking-widest`}>{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Field = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">{label}</label>
    <input {...props} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-amber-400 transition-all" />
  </div>
);

const FieldDark = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">{label}</label>
    <input {...props} className="w-full p-4 bg-slate-800 rounded-2xl outline-none text-sm font-bold text-white focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-600" />
  </div>
);

export default CustomaryMarriageForm;
