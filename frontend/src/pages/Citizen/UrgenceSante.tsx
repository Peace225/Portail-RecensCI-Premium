import React from "react";
import { Activity, PhoneCall, Stethoscope, Pill, HeartPulse, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const UrgenceSante: React.FC = () => {
  const actions = [
    { 
      title: "Appeler les Urgences (SAMU)", 
      desc: "Déclenchement immédiat avec transmission de votre position GPS et de votre groupe sanguin.", 
      icon: <PhoneCall size={24} />, 
      link: "/urgence-sante/samu", // Corrigé : pointe vers la nouvelle vue SAMU
      urgent: true 
    },
    { 
      title: "SOS Médecin à Domicile", 
      desc: "Demandez l'intervention du médecin de garde le plus proche de votre domicile.", 
      icon: <Stethoscope size={24} />, 
      link: "/urgence-sante/medecin" 
    },
    { 
      title: "Pharmacies de Garde", 
      desc: "Géolocalisation des pharmacies ouvertes autour de vous en temps réel.", 
      icon: <Pill size={24} />, 
      link: "/urgence-sante/pharmacies" 
    },
    { 
      title: "Mon Carnet Vital", 
      desc: "Vos données médicales d'urgence (Groupe sanguin, allergies, vaccins).", 
      icon: <HeartPulse size={24} />, 
      link: "/urgence-sante/carnet" 
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Activity className="text-red-500" /> Urgence Santé
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Accès rapide aux services médicaux et transmission sécurisée de vos constantes vitales aux secouristes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {actions.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.link} 
            className={`relative group p-6 border rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
              item.urgent 
                ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50" 
                : "bg-slate-900 border-white/5 hover:border-orange-500/30"
            }`}
          >
            {/* Effet lumineux en arrière-plan pour l'urgence */}
            {item.urgent && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-3xl rounded-full pointer-events-none" />
            )}

            <div className="flex items-start justify-between w-full mb-4 z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                item.urgent 
                  ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                  : "bg-slate-800 text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-500/10 border border-white/5"
              }`}>
                {item.icon}
              </div>
              {item.urgent && (
                <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg animate-pulse">
                  Intervention Immédiate
                </span>
              )}
            </div>

            <div className="z-10">
              <h3 className={`font-bold text-sm tracking-wide flex items-center justify-between ${item.urgent ? "text-red-50" : "text-white"}`}>
                {item.title}
                <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${item.urgent ? "text-red-300" : "text-slate-600"}`} />
              </h3>
              <p className={`text-xs mt-2 pr-4 ${item.urgent ? "text-red-200/80" : "text-slate-500"}`}>
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UrgenceSante;