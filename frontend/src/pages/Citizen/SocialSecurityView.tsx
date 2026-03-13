// src/pages/Citizen/SocialSecurityView.tsx
import React from "react";
import { 
  ShieldCheck, CreditCard, GraduationCap, 
  ArrowRight, Clock, CheckCircle2, AlertCircle,
  Wallet, TrendingUp, Landmark, ShieldAlert
} from "lucide-react";

const SocialSecurityView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* --- HEADER : STYLE "ELITE PROTECTION" --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-black p-10 md:p-16 rounded-[4rem] shadow-2xl text-white">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none rotate-12">
          <ShieldCheck size={250} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-2xl text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck size={14} /> Couverture Universelle Active
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
              Mon Patrimoine <br /> <span className="text-blue-500">Social</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed">
              Vos droits sont automatiquement calculés et sécurisés grâce au Registre National des Personnes Physiques.
            </p>
          </div>

          {/* Widget Solde / Estimation */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] w-full md:w-80 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Mensuel Estimé</p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white">425.000 <span className="text-xs text-blue-500 uppercase">CFA</span></h2>
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Prochain virement : 05 Avril 2026</p>
            </div>
            <button className="w-full py-4 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
              Historique des Paiements
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- COLONNE PRINCIPALE : PRESTATIONS --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-4">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">Flux de Prestations</h3>
             <span className="text-[10px] font-bold text-slate-400">Dernière mise à jour : 13 Mars 2026</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <PrestationCard 
              title="Pension de Réversion (Veuve)"
              status="EN_COURS"
              amount="250.000 CFA"
              desc="Déclenchement automatique suite au décès déclaré. En attente de signature ministérielle."
              icon={<Landmark className="text-blue-600" />}
              color="blue"
            />

            <PrestationCard 
              title="Allocation Éducation Orphelins"
              status="VALIDE"
              amount="175.000 CFA"
              desc="Soutien scolaire pour Kouame Axel et Sarah. Virement direct sur compte boursier."
              icon={<GraduationCap className="text-emerald-600" />}
              color="emerald"
            />
          </div>
        </div>

        {/* --- COLONNE DROITE : ACTIONS & SÉCURITÉ --- */}
        <aside className="space-y-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] px-2">Actions Requises</h3>
          
          {/* Alerte RIB */}
          <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 tracking-tight">Coordonnées Bancaires</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Votre RIB actuel n'est pas certifié. Pour recevoir vos fonds, veuillez télécharger votre attestation de compte.
                </p>
              </div>
              <button className="w-full py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3">
                Certifier mon RIB <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Guide Rapide */}
          <div className="bg-slate-50 p-8 rounded-[3.5rem] border border-transparent hover:border-slate-200 transition-all space-y-4">
             <div className="flex items-center gap-3 text-slate-900">
                <ShieldAlert size={20} className="text-orange-500" />
                <h4 className="text-xs font-black uppercase">Sécurité des Fonds</h4>
             </div>
             <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                Toute modification de vos droits nécessite une vérification biométrique via l'application.
             </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

// --- MINI COMPOSANT CARTE DE PRESTATION SUBBLIMÉ ---
const PrestationCard = ({ title, status, amount, desc, icon, color }: any) => {
  const isPending = status === "EN_COURS";
  
  return (
    <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-1 h-full bg-${color}-500 opacity-0 group-hover:opacity-100 transition-all`} />
      
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
        <div className={`w-20 h-20 bg-${color}-50 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
          {icon}
        </div>
        
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-xl font-black text-slate-900 tracking-tighter italic">{title}</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref: {Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-slate-900">{amount}</p>
               <span className={`inline-block mt-2 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] ${isPending ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'} shadow-lg shadow-current/10`}>
                 {isPending ? "Analyse en cours" : "Virement Actif"}
               </span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 leading-relaxed font-medium border-l-2 border-slate-100 pl-4">
            {desc}
          </p>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Actualisé il y a 2h</span>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
              Voir l'échéancier <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSecurityView;