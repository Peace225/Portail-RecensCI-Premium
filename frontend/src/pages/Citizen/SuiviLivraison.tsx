import React from "react";
import { Truck, Package, CheckCircle, Clock } from "lucide-react";

const SuiviLivraison: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Truck className="text-orange-500" /> Suivi des Démarches
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Suivez l'acheminement de vos documents physiques.</p>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
          <div>
            <h3 className="text-white font-bold">Extrait de Naissance</h3>
            <p className="text-slate-500 text-xs mt-1">Demande N° 982-KJH</p>
          </div>
          <span className="bg-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
            En Transit
          </span>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-orange-500 before:via-orange-500/50 before:to-slate-800">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-orange-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_rgba(255,130,0,0.2)] z-10">
              <CheckCircle size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <h4 className="font-bold text-white text-sm">Signé par l'Officier</h4>
              <p className="text-slate-400 text-xs mt-1">Mairie de Korhogo</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-slate-800 text-orange-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Package size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-slate-900 border border-white/5">
              <h4 className="font-bold text-white text-sm">En route vers Abidjan</h4>
              <p className="text-slate-500 text-xs mt-1">Réseau d'interconnexion sécurisé</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-slate-800 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Clock size={16} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl opacity-50">
              <h4 className="font-bold text-slate-400 text-sm">Prêt pour retrait</h4>
              <p className="text-slate-600 text-xs mt-1">Mairie de Cocody</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuiviLivraison;