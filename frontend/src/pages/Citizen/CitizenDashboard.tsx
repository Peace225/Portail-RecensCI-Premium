import React from "react";
import { 
  Users, FileCheck, ShieldAlert, Activity, 
  ArrowUpRight, Clock, Fingerprint, TrendingUp, 
  MapPin, Calendar, Wallet 
} from "lucide-react";

const CitizenDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-1000">
      
      {/* --- HEADER PREMIUM --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Fingerprint size={200} />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-orange-500 text-[10px] font-black uppercase rounded-lg tracking-widest">Compte Vérifié</span>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">ID: CI-0102938475</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">Bienvenue, Kevin Gael</h1>
          <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
            <MapPin size={14} className="text-orange-500" /> Cocody, Abidjan • Dernière mise à jour le 13 Mars 2026
          </p>
        </div>
        <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-5">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score de Complétude</p>
              <p className="text-2xl font-black">92%</p>
           </div>
           <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-slate-700 flex items-center justify-center text-[10px] font-black">
              92%
           </div>
        </div>
      </div>

      {/* --- SECTION 1 : CARTES DE STATS ÉVOLUÉES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users size={24} />} 
          label="Ménage" 
          value="05" 
          trend="+1 Membre"
          color="orange" 
        />
        <StatCard 
          icon={<FileCheck size={24} />} 
          label="Validations" 
          value="12" 
          trend="Flux 100%"
          color="emerald" 
        />
        <StatCard 
          icon={<Wallet size={24} />} 
          label="Prestations" 
          value="02" 
          trend="Actives"
          color="blue" 
        />
        <StatCard 
          icon={<ShieldAlert size={24} />} 
          label="Risques" 
          value="00" 
          trend="Protégé"
          color="red" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- SECTION 2 : VISUALISATION GRAPHIQUE DU MÉNAGE --- */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Répartition du Foyer</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Données de l'annuaire national</p>
              </div>
              <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-500 transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>

            {/* Simulation d'un graphique à barres horizontal pour les âges */}
            <div className="space-y-6">
               <GraphBar label="Chef de famille" value={95} age="35 ans" color="bg-orange-500" />
               <GraphBar label="Conjoint(e)" value={85} age="28 ans" color="bg-orange-400" />
               <GraphBar label="Enfant (Mineur)" value={45} age="12 ans" color="bg-slate-900" />
               <GraphBar label="Enfant (Mineur)" value={30} age="08 ans" color="bg-slate-700" />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Membres Actifs</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MiniProfile name="Kevin Gael" role="Déclarant" />
                <MiniProfile name="Traoré Aminata" role="Épouse" />
             </div>
          </div>
        </div>

        {/* --- SECTION 3 : ACTIVITÉS & TIMELINE STYLE DARK --- */}
        <div className="space-y-8">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
               <TrendingUp size={200} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
              <Activity size={16} /> Flux Système
            </h3>
            
            <div className="space-y-8 relative z-10">
              <TimelineItem 
                title="Mise à jour adresse" 
                date="Aujourd'hui, 14:20" 
                status="Succès" 
              />
              <TimelineItem 
                title="Demande d'acte" 
                date="Hier, 09:15" 
                status="En cours" 
              />
              <TimelineItem 
                title="Déclenchement Social" 
                date="10 Mars 2026" 
                status="Auto" 
              />
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all">
              Voir tout l'historique
            </button>
          </div>

          {/* Widget Calendrier/Rappel */}
          <div className="bg-orange-500 p-8 rounded-[3rem] text-white shadow-xl shadow-orange-200 space-y-4">
             <Calendar size={32} className="opacity-50" />
             <p className="text-xs font-black uppercase tracking-widest">Rappel Prochain Recensement</p>
             <p className="text-3xl font-black">Janv 2027</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPOSANTS DE DESIGN INTERNES ---

const StatCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
    <div className={`w-14 h-14 bg-${color}-500/10 text-${color}-600 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-${color}-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-${color}-100`}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
      <div className="flex items-center gap-2 mt-4">
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100">
           <TrendingUp size={10} className="text-emerald-600" />
        </span>
        <p className="text-[9px] font-black text-emerald-500 uppercase">{trend}</p>
      </div>
    </div>
  </div>
);

const GraphBar = ({ label, value, age, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{label}</p>
      <p className="text-[10px] font-bold text-slate-400">{age}</p>
    </div>
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const MiniProfile = ({ name, role }: any) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.5rem] border border-transparent hover:border-orange-200 transition-all cursor-pointer group">
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-orange-500 font-black shadow-sm">
      {name.charAt(0)}
    </div>
    <div>
      <p className="text-xs font-black text-slate-900">{name}</p>
      <p className="text-[9px] font-bold text-slate-400 uppercase">{role}</p>
    </div>
  </div>
);

const TimelineItem = ({ title, date, status }: any) => (
  <div className="flex gap-4 group">
    <div className="w-1 bg-white/10 rounded-full h-12 relative">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full border-4 border-slate-900"></div>
    </div>
    <div>
       <p className="text-[11px] font-black text-white group-hover:text-orange-500 transition-colors">{title}</p>
       <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{date} • <span className="text-emerald-500">{status}</span></p>
    </div>
  </div>
);

export default CitizenDashboard;