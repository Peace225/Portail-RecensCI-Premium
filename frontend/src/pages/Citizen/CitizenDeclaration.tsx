import React, { useState } from "react";
import { 
  Users, UserPlus, Baby, Heart, Skull, 
  Home, ShieldCheck, ChevronRight, Fingerprint, 
  X, Save, Sparkles, MapPin, Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CitizenProfile: React.FC = () => {
  const navigate = useNavigate();
  const [householdType, setHouseholdType] = useState<"SEUL" | "MENAGE">("MENAGE");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-12 animate-in fade-in duration-1000">
      
      {/* --- HEADER PREMIUM --- */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-8 md:p-12 shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Fingerprint size={150} className="text-orange-500" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative w-32 h-32 bg-slate-800 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-orange-500 font-black text-4xl shadow-2xl">
                KG
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-slate-900">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic">Kevin Gael Kouhame</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-5 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-lg shadow-orange-500/20">Chef de Famille</span>
                <span className="text-slate-400 font-medium text-sm tracking-widest border-l border-white/10 pl-4 uppercase">CI-0102938475</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* --- SECTION 01 : MÉNAGE --- */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 ml-2">
            <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">01. Annuaire Familial</h2>
          </div>
          
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 space-y-10">
            <div className="flex p-2 bg-slate-50 rounded-[2rem]">
              <ToggleButton active={householdType === "SEUL"} onClick={() => setHouseholdType("SEUL")} label="Vivre Seul" />
              <ToggleButton active={householdType === "MENAGE"} onClick={() => setHouseholdType("MENAGE")} label="En Ménage" />
            </div>

            {householdType === "MENAGE" && (
              <div className="space-y-6 animate-in slide-in-from-top-2">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Membres rattachés</h3>
                  <button 
                    onClick={() => navigate("/declarer-naissance")} 
                    className="px-6 py-2.5 bg-orange-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all"
                  >
                    + Ajouter un membre
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <MemberItem name="Marie-Evelyne Kouhame" role="Épouse" onClick={() => setActiveModal("Détails : Marie-Evelyne")} />
                  <MemberItem name="Marc-Antoine Kouhame" role="Enfant" onClick={() => setActiveModal("Détails : Marc-Antoine")} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 02 : DÉCLARATIONS --- */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 ml-2">
            <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em]">02. Actes & Événements</h2>
          </div>

          <div className="grid grid-cols-1 gap-5">
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
        </section>
      </div>

      {/* --- MODAL DE DÉTAILS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl space-y-6 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto text-slate-900">
              <Fingerprint size={40} />
            </div>
            <h2 className="text-2xl font-black italic tracking-tight uppercase">{activeModal}</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Consultation des informations du registre national pour ce membre du foyer.
            </p>
            <button 
              onClick={() => setActiveModal(null)} 
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-colors"
            >
              Fermer la fiche
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MINI COMPONENTS ---
const ToggleButton = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick} 
    className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
      active ? "bg-white text-slate-900 shadow-xl" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
  </button>
);

const MemberItem = ({ name, role, onClick }: any) => (
  <div onClick={onClick} className="group flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-orange-500/30 hover:bg-white transition-all cursor-pointer">
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
    className="flex items-center gap-6 p-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all text-left group w-full"
  >
    <div className={`p-5 bg-slate-50 rounded-[1.5rem] ${color} group-hover:bg-slate-900 group-hover:text-white transition-all`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h4>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Démarrer la procédure</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-orange-600 group-hover:text-white transition-all">
      <ChevronRight size={18} />
    </div>
  </button>
);

export default CitizenProfile;