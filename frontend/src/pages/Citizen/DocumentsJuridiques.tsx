import React from "react";
import { Scale, ShieldCheck, FileBadge, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DocumentsJuridiques: React.FC = () => {
  const documents = [
    { 
      title: "Casier Judiciaire", 
      desc: "Extrait de casier judiciaire (Bulletin n°3)", 
      icon: <Scale size={24} />, 
      link: "/documents-juridiques/casier" 
    },
    { 
      title: "Certificat de Nationalité", 
      desc: "Preuve officielle de votre nationalité", 
      icon: <ShieldCheck size={24} />, 
      link: "/documents-juridiques/nationalite" 
    },
    { 
      title: "Légalisation de documents", 
      desc: "Certification conforme de vos diplômes et pièces", 
      icon: <FileBadge size={24} />, 
      link: "/documents-juridiques/legalisation" 
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Scale className="text-orange-500" /> Nationalité & Casier
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Gérez vos demandes de documents juridiques et certificats officiels.</p>
      </div>

      <div className="flex flex-col gap-4">
        {documents.map((doc, idx) => (
          <Link key={idx} to={doc.link} className="group p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                {doc.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">{doc.title}</h3>
                <p className="text-slate-500 text-xs mt-1">{doc.desc}</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-slate-600 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DocumentsJuridiques;