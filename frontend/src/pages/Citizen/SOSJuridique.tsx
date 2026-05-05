import React from "react";
import { ShieldAlert, Gavel, Scale, AlertTriangle, MessageSquareWarning, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SOSJuridique: React.FC = () => {
  const services = [
    { 
      title: "Signaler une violence ou un abus", 
      desc: "Plateforme discrète pour alerter les autorités (VBG, harcèlement, violences familiales).", 
      icon: <AlertTriangle size={24} />, 
      link: "/sos-juridique/signalement",
      badge: "Confidentiel",
      alert: true
    },
    { 
      title: "Trouver un Avocat", 
      desc: "Annuaire certifié par l'ordre des avocats et demande d'assistance judiciaire.", 
      icon: <Scale size={24} />, 
      link: "/sos-juridique/avocats" 
    },
    { 
      title: "Médiation de Proximité", 
      desc: "Réglez vos litiges de voisinage ou commerciaux à l'amiable avec un médiateur certifié.", 
      icon: <MessageSquareWarning size={24} />, 
      link: "/sos-juridique/mediation" 
    },
    { 
      title: "Consultation Juridique", 
      desc: "Prenez rendez-vous en ligne ou discutez avec un conseiller juridique de permanence.", 
      icon: <Gavel size={24} />, 
      link: "/sos-juridique/consultation" 
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <ShieldAlert className="text-orange-500" /> SOS Juridique
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Faites valoir vos droits, signalez des infractions et obtenez une assistance légale certifiée.
          </p>
        </div>
        {/* Bouton d'urgence Police */}
        <button className="shrink-0 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group">
          <ShieldAlert size={16} className="text-orange-500 group-hover:animate-bounce" />
          Appeler la Police (111)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.link} 
            className="group p-6 bg-slate-900 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between w-full mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                item.alert 
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                  : "bg-slate-800 text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-500/10 border border-white/5"
              }`}>
                {item.icon}
              </div>
              {item.badge && (
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                  item.alert ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-slate-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-white font-bold text-sm tracking-wide flex items-center justify-between">
                {item.title}
                <ArrowRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-slate-500 text-xs mt-2 pr-4 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SOSJuridique;