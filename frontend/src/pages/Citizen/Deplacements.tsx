import React from "react";
import { Plane, BookUser, Map, CarFront, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Deplacements: React.FC = () => {
  const voyages = [
    { 
      title: "Demande de Passeport", 
      desc: "Première demande ou renouvellement biométrique", 
      icon: <BookUser size={24} />, 
      link: "/deplacements/passeport",
      badge: "Populaire"
    },
    { 
      title: "Laisser-passer / Sauf-conduit", 
      desc: "Titre de voyage d'urgence temporaire", 
      icon: <Plane size={24} />, 
      link: "/deplacements/laisser-passer" 
    },
    { 
      title: "Enregistrer un déplacement", 
      desc: "Déclarez un trajet inter-urbain pour votre sécurité", 
      icon: <Map size={24} />, 
      link: "/deplacements/declaration-trajet" 
    },
    { 
      title: "Permis de conduire / VTC", 
      desc: "Liaison de votre permis à votre identité numérique", 
      icon: <CarFront size={24} />, 
      link: "/deplacements/permis" 
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Plane className="text-orange-500" /> Passeport & Déplacements
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Préparez vos voyages internationaux et déclarez vos déplacements nationaux pour garantir votre sécurité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voyages.map((item, idx) => (
          <Link key={idx} to={item.link} className="relative group p-6 bg-slate-900 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            
            {/* Décoration d'arrière-plan */}
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {item.icon}
            </div>

            <div className="flex items-start justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all">
                {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
              </div>
              {item.badge && (
                <span className="bg-orange-500/20 text-orange-500 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                  {item.badge}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-white font-bold text-sm tracking-wide flex items-center justify-between">
                {item.title}
                <ArrowRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-slate-500 text-xs mt-2 pr-4">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Deplacements;