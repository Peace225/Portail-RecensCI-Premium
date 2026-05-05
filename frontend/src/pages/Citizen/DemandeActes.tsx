import React from "react";
import { 
  FileSignature, ScrollText, Copy, FileWarning, 
  ArrowRight, QrCode, Truck, MapPin, ShieldCheck, CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";

const DemandeActes: React.FC = () => {
  const actions = [
    { title: "Extrait de Naissance", desc: "Demander une copie pour vous ou un proche", icon: <ScrollText size={24} />, link: "/demande-actes/naissance" },
    { title: "Copie Intégrale", desc: "Document complet avec filiation", icon: <Copy size={24} />, link: "/demande-actes/integrale" },
    { title: "Acte de Mariage", desc: "Extrait de votre acte de mariage", icon: <FileSignature size={24} />, link: "/demande-actes/mariage" },
    { title: "Acte de Décès", desc: "Pour les démarches de succession", icon: <FileWarning size={24} />, link: "/demande-actes/deces" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <FileSignature className="text-orange-500" /> État Civil & Démarches
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Gérez vos documents officiels. Profitez de l'interconnexion nationale pour retirer vos actes partout ou les faire livrer chez vous.
        </p>
      </div>

      {/* =========================================
          SECTION 1 : COFFRE-FORT & LOGISTIQUE
          ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        
        {/* Carte : Coffre-Fort Numérique */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#020617] border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="text-emerald-500" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-sm">Coffre-Fort Certifié</h2>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Vos actes générés sont stockés ici. Plus besoin de refaire des demandes : présentez simplement votre QR Code dynamique aux administrations pour vérification immédiate.
            </p>
          </div>

          <Link to="/documents/coffre-fort" className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95">
            <QrCode size={18} />
            Ouvrir mon Coffre-Fort
          </Link>
        </div>

        {/* Carte : Retrait & Livraison (Interconnexion) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#020617] border border-orange-500/20 rounded-3xl p-6 flex flex-col justify-between group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="text-orange-500" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-sm">Réseau National & Livraison</h2>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2 text-slate-400 text-xs">
                <CheckCircle2 size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Né(e) à <strong className="text-slate-200">Korhogo</strong> ? Retirez votre acte à la mairie d'<strong className="text-slate-200">Abidjan</strong>.</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-xs">
                <CheckCircle2 size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Option de livraison à domicile par coursier sécurisé.</span>
              </li>
            </ul>
          </div>

          <Link to="/mes-demandes/suivi-livraison" className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95">
            <Truck size={18} />
            Suivre mes livraisons
          </Link>
        </div>

      </div>

      {/* =========================================
          SECTION 2 : NOUVELLES DEMANDES
          ========================================= */}
      <h3 className="text-[10px] font-black text-slate-500 mb-4 px-2 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Nouvelle Demande
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.link} 
            className="group p-5 bg-slate-900 border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-[0_0_20px_rgba(255,130,0,0.05)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                {item.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
              <ArrowRight size={16} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default DemandeActes;