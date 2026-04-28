// src/pages/Citizen/CitizenProfile.tsx
import React, { useState } from "react";
import { 
  User, MapPin, FileCheck, Bell, ShieldCheck, 
  QrCode, Users, ChevronRight, Baby, Heart, Skull, Info, Cpu
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const CitizenProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [householdType, setHouseholdType] = useState<"SEUL" | "MENAGE">("MENAGE");

  return (
    // AJOUT : pt-32 pour descendre sous le Header/Ticker, min-h-screen et bg sombre
    <div className="min-h-screen bg-[#020617] text-slate-300 pt-32 p-4 md:p-8 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(249,115,22,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10 animate-in slide-in-from-bottom-4 duration-700">
        
        {/* 1. CARTE D'IDENTITÉ NUMÉRIQUE (TON DESIGN PREMIUM CONSERVÉ) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full -mr-20 -mt-20 blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-black/40 border-2 border-white/10 overflow-hidden backdrop-blur-md p-1 group cursor-pointer hover:border-orange-500/50 transition-all shadow-2xl" onClick={() => toast.info("Mise à jour photo bientôt disponible")}>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" alt="Avatar" className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic">{user.name || "KOUHAME Kevin Gael"}</h2>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                 <Cpu size={14} className="text-orange-500" />
                 <p className="text-orange-400 font-bold tracking-[0.2em] text-xs uppercase italic">Numéro National : {user.nni || 'NNI non assigné'}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                <ProfileBadge label="Statut Civil" value="Marié" />
                <ProfileBadge label="Résidence" value="Abidjan, Cocody" />
                <ProfileBadge label="Profession" value="Développeur" />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] shadow-xl hover:scale-105 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all cursor-help group backdrop-blur-md" onClick={() => toast.success("ID Numérique Certifié Valide")}>
               <QrCode size={70} className="text-white group-hover:text-orange-500 transition-colors" />
               <p className="text-[8px] text-slate-400 font-black text-center mt-3 uppercase tracking-widest group-hover:text-white transition-colors">Vérifier ID</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
          
          {/* 2. ANNUAIRE FAMILIAL (PASSÉ EN DARK MODE) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-4">
              <Users className="text-orange-500" size={20} />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">01. Recensement & Population</h2>
            </div>
            
            <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[3rem] shadow-2xl border border-white/5 space-y-8">
              <div className="flex p-2 bg-black/40 rounded-[2rem] border border-white/5">
                <button 
                  onClick={() => { setHouseholdType("SEUL"); toast.info("Statut mis à jour : Vit seul"); }}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${householdType === "SEUL" ? "bg-slate-800 text-white shadow-lg border border-white/10" : "text-slate-500 hover:text-white"}`}
                >
                  Vivre Seul
                </button>
                <button 
                  onClick={() => setHouseholdType("MENAGE")}
                  className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${householdType === "MENAGE" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 border border-orange-500/50" : "text-slate-500 hover:text-white"}`}
                >
                  En Ménage
                </button>
              </div>

              {householdType === "MENAGE" && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Membres rattachés</h3>
                    <button 
                      onClick={() => navigate("/recensement-details")} // Redirection vers ton beau formulaire de recensement !
                      className="px-5 py-2.5 bg-white/5 hover:bg-orange-500 text-slate-300 hover:text-white border border-white/10 hover:border-orange-500 text-[9px] font-black uppercase rounded-xl transition-all flex items-center gap-2"
                    >
                      <Users size={12} /> Gérer le foyer
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <MemberItem name="Marie-Evelyne Kouhame" role="Épouse" />
                    <MemberItem name="Marc-Antoine Kouhame" role="Enfant" />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. ÉTAT CIVIL (PASSÉ EN DARK MODE) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 ml-4">
              <ShieldCheck className="text-emerald-500" size={20} />
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">02. Actes & Événements</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <ActionCard 
                title="Déclarer une Naissance" 
                icon={<Baby size={24} />} 
                color="text-emerald-500"
                hoverColor="hover:border-emerald-500/50" 
                onClick={() => navigate("/declarer-naissance")} 
              />
              <ActionCard 
                title="Mettre à jour mon Statut" 
                icon={<Heart size={24} />} 
                color="text-pink-500"
                hoverColor="hover:border-pink-500/50" 
                onClick={() => navigate("/declarer-statut")} 
              />
              <ActionCard 
                title="Signaler un Décès" 
                icon={<Skull size={24} />} 
                color="text-slate-400"
                hoverColor="hover:border-slate-500/50" 
                onClick={() => navigate("/declarer-deces")} 
              />
            </div>

            <div className="bg-blue-500/10 p-6 rounded-[2rem] border border-blue-500/20 flex gap-4 mt-6">
              <Info className="text-blue-400 shrink-0" size={20} />
              <p className="text-[10px] text-blue-200 font-bold leading-relaxed italic tracking-wide">
                Les déclarations effectuées alimentent automatiquement l'annuaire national pour garantir vos droits sociaux en temps réel.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- COMPOSANTS INTERNES CYBER-CONVERTIS ---

const ProfileBadge = ({ label, value }: any) => (
  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner">
    <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em]">{label}</p>
    <p className="text-xs font-black text-white mt-1 uppercase tracking-wider">{value}</p>
  </div>
);

const MemberItem = ({ name, role }: any) => (
  <div className="group flex items-center justify-between p-5 bg-black/20 rounded-3xl border border-white/5 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-400 transition-all shadow-sm">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-black text-white tracking-tight">{name}</p>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{role}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-600 group-hover:text-orange-500 transition-colors" />
  </div>
);

const ActionCard = ({ title, icon, color, hoverColor, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-6 p-6 bg-slate-900/40 rounded-[2.5rem] border border-white/5 shadow-lg hover:shadow-2xl hover:bg-white/5 ${hoverColor} transition-all text-left group w-full`}
  >
    <div className={`p-5 bg-black/40 rounded-[1.5rem] ${color} group-hover:scale-110 transition-transform border border-white/5`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-orange-500 transition-colors">{title}</h4>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">Démarrer la procédure</p>
    </div>
    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
       <ChevronRight size={16} className="text-slate-600 group-hover:text-orange-500 transition-all" />
    </div>
  </button>
);

export default CitizenProfile;