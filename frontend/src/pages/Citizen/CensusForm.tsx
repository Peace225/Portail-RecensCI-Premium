// src/pages/Citizen/CensusForm.tsx
import React from "react";
import { Home, Users, Zap, Droplets, Save } from "lucide-react";
import { Card, CardContent } from "../../components/Card";

const CensusForm: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Recensement & Population</h1>
        <p className="text-slate-500 font-medium">Renseignements complets sur l'habitat et le ménage</p>
      </div>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        {/* SECTION A : TYPE D'HABITAT */}
        <Card className="rounded-[2.5rem] border-none shadow-lg">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <Home size={16} /> A. Caractéristiques du Logement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectGroup label="Type de Logement" options={["Maison Individuelle", "Appartement", "Studio", "Case"]} />
              <InputGroup label="Nombre de pièces" type="number" placeholder="Ex: 3" />
              <SelectGroup label="Accès à l'Électricité" options={["CIE - Compteur", "Solaire", "Aucun"]} />
              <SelectGroup label="Accès à l'Eau" options={["SODECI", "Puits", "Pompe Villageoise"]} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION B : COMPOSITION DU MÉNAGE */}
        <Card className="rounded-[2.5rem] border-none shadow-lg">
          <CardContent className="p-8 space-y-6">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Users size={16} /> B. Membres du Ménage
            </h3>
            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <p className="text-xs text-slate-500 font-bold">Indiquez le nombre de personnes vivant sous votre toit :</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InputGroup label="Hommes" type="number" placeholder="0" />
                <InputGroup label="Femmes" type="number" placeholder="0" />
                <InputGroup label="Enfants (-15 ans)" type="number" placeholder="0" />
                <InputGroup label="Séniors (+65 ans)" type="number" placeholder="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <button type="submit" className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
          <Save size={18} /> Enregistrer le recensement
        </button>
      </form>
    </div>
  );
};

const InputGroup = ({ label, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold" {...props} />
  </div>
);

const SelectGroup = ({ label, options }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700">
      {options.map((o: string) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

export default CensusForm;