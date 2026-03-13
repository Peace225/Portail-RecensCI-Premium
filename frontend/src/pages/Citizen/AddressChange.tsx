// src/pages/Citizen/AddressChange.tsx
import React from "react";
import { MapPin, ArrowRight, Info } from "lucide-react";

const AddressChange = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><MapPin size={120} /></div>
        
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Migration Interne</h2>
        <p className="text-slate-500 font-medium mb-8">Déclarez votre déménagement pour mettre à jour la carte démographique nationale.</p>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Adresse actuelle enregistrée</p>
            <p className="font-bold text-slate-800">Abidjan, Cocody, Riviera Palmerais, Rue Ministre</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nouvelle Ville</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Yamoussoukro" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nouveau Quartier</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="Ex: Morofé" />
             </div>
          </div>

          <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-blue-200">
            Enregistrer ma nouvelle adresse <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressChange;