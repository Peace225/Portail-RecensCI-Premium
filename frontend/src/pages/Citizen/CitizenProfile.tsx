// src/pages/Citizen/CitizenProfile.tsx
import React, { useState } from "react";
import { 
  User, MapPin, FileCheck, Bell, ShieldCheck, 
  QrCode, Users, ChevronRight, Baby, Heart, Skull, Info 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CitizenProfile: React.FC = () => {
  const navigate = useNavigate();
  const [householdType, setHouseholdType] = useState<"SEUL" | "MENAGE">("MENAGE");

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. CARTE D'IDENTITÉ NUMÉRIQUE (TON DESIGN PREMIUM) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-white/10 border-2 border-white/20 overflow-hidden backdrop-blur-md p-1 group cursor-pointer" onClick={() => toast.info("Mise à jour photo bientôt disponible")}>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" alt="Avatar" className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black tracking-tight italic">KOUHAME Kevin Gael</h2>
            <p className="text-orange-400 font-bold tracking-[0.2em] text-xs uppercase mt-1 italic">Numéro National : CI-002938475</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <ProfileBadge label="Statut Civil" value="Marié" />
              <ProfileBadge label="Résidence" value="Abidjan, Cocody" />
              <ProfileBadge label="Profession" value="Développeur" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-xl hover:scale-105 transition-transform cursor-help group" onClick={() => toast.success("ID Numérique Certifié")}>
             <QrCode size={80} className="text-slate-900" />
             <p className="text-[8px] text-slate-400 font-black text-center mt-2 uppercase tracking-widest">Vérifier ID</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. ANNUAIRE FAMILIAL (SECTION INTERACTIVE) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-4">
            <Users className="text-orange-600" size={20} />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">01. Recensement & Population</h2>
          </div>
          
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
            <div className="flex p-2 bg-slate-100 rounded-[2rem]">
              <button 
                onClick={() => { setHouseholdType("SEUL"); toast.info("Statut mis à jour : Vit seul"); }}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${householdType === "SEUL" ? "bg-white text-slate-900 shadow-md" : "text-slate-400"}`}
              >
                Vivre Seul
              </button>
              <button 
                onClick={() => setHouseholdType("MENAGE")}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${householdType === "MENAGE" ? "bg-white text-orange-600 shadow-md" : "text-slate-400"}`}
              >
                En Ménage
              </button>
            </div>

            {householdType === "MENAGE" && (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-500">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Membres rattachés</h3>
                  <button 
                    onClick={() => navigate("/declarer-naissance")} // REDIRECTION FONCTIONNELLE
                    className="px-6 py-2.5 bg-orange-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
                  >
                    + Ajouter un membre
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

        {/* 3. ÉTAT CIVIL (DÉCLARATIONS) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 ml-4">
            <ShieldCheck className="text-orange-600" size={20} />
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">02. Actes & Événements</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <ActionCard 
              title="Déclarer une Naissance" 
              icon={<Baby size={24} />} 
              color="text-emerald-500" 
              onClick={() => navigate("/declarer-naissance")} 
            />
            <ActionCard 
              title="Mettre à jour mon Statut" 
              icon={<Heart size={24} />} 
              color="text-pink-500" 
              onClick={() => navigate("/declarer-statut")} 
            />
            <ActionCard 
              title="Signaler un Décès" 
              icon={<Skull size={24} />} 
              color="text-slate-400" 
              onClick={() => navigate("/declarer-deces")} 
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex gap-4 mt-6">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] text-blue-700 font-bold leading-relaxed italic">
              Les déclarations effectuées alimentent automatiquement l'annuaire national pour garantir vos droits sociaux.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- COMPOSANTS INTERNES ---

const ProfileBadge = ({ label, value }: any) => (
  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{label}</p>
    <p className="text-sm font-bold text-white">{value}</p>
  </div>
);

const MemberItem = ({ name, role }: any) => (
  <div className="group flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-orange-500/30 hover:bg-white transition-all cursor-pointer">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-black text-slate-900 tracking-tight">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{role}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
  </div>
);

const ActionCard = ({ title, icon, color, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group w-full"
  >
    <div className={`p-5 bg-slate-50 rounded-[1.5rem] ${color} group-hover:bg-slate-900 group-hover:text-white transition-all`}>
      {icon}
    </div>
    <div className="flex-1 text-slate-900">
      <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Démarrer la procédure</p>
    </div>
    <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-600 transition-all" />
  </button>
);

export default CitizenProfile;