import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"; 
import { RootState } from "../../store"; 
import { 
  FileText, Bell, HelpCircle, 
  ChevronRight, ShieldCheck, Home, Users, 
  Baby, Heart, Skull, MapPin, Menu, X,
  FileSignature, Scale, Plane, Activity, ShieldAlert
} from "lucide-react";

const citizenMenuItems = [
  {
    group: "1. Recensement & Population",
    items: [
      { name: "Mon Profil & Ménage", path: "/me", icon: <Home size={18} /> },
      { name: "Renseignements", path: "/recensement-details", icon: <Users size={18} /> },
      { name: "Changement d'adresse", path: "/migrations", icon: <MapPin size={18} /> },
      { name: "Prestations & Droits", path: "/prestations", icon: <ShieldCheck size={18} /> },
    ]
  },
  {
    group: "2. État Civil & Démarches",
    items: [
      { name: "Déclarer naissance", path: "/declarer-naissance", icon: <Baby size={18} /> },
      { name: "Mariage ou Divorce", path: "/declarer-statut", icon: <Heart size={18} /> },
      { name: "Déclarer un décès", path: "/declarer-deces", icon: <Skull size={18} /> },
      { name: "Demande d'actes", path: "/demande-actes", icon: <FileSignature size={18} /> },
      { name: "Nationalité & Casier", path: "/documents-juridiques", icon: <Scale size={18} /> },
      { name: "Passeport & Déplacements", path: "/deplacements", icon: <Plane size={18} /> },
      { name: "Mes documents", path: "/mes-demandes", icon: <FileText size={18} /> },
    ]
  },
  {
    group: "3. Assistance (Santé & Droit)",
    items: [
      { name: "Urgence Santé", path: "/urgence-sante", icon: <Activity size={18} /> },
      { name: "SOS Juridique", path: "/sos-juridique", icon: <ShieldAlert size={18} /> },
      { name: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
      { name: "Centre d'aide SOS", path: "/aide", icon: <HelpCircle size={18} /> },
    ]
  }
];

const CitizenSidebar: React.FC = () => {
  const { name, photoUrl } = useSelector((state: RootState) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* =========================================
          VERSION DESKTOP (SIDEBAR À GAUCHE)
          ========================================= */}
      <aside className="hidden md:flex w-72 min-w-[288px] shrink-0 bg-[#020617] text-slate-400 h-screen flex-col border-r border-white/5 relative z-50 font-sans overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* PROFIL HEADER */}
        <div className="p-8 mb-2 relative">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-orange-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-11 h-11 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profil" className="w-full h-full object-cover z-10" />
                ) : (
                  <span className="font-black text-xl text-white italic z-10">R</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent h-[200%] w-full animate-[scan_3s_linear_infinite] z-20 pointer-events-none" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[13px] font-black tracking-tighter text-white uppercase truncate">
                {name || <>RECENS<span className="text-[#FF8200] italic">CI</span></>}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight truncate">Espace Citoyen</p>
                <span className="flex shrink-0 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar pb-10 relative z-10">
          {citizenMenuItems.map((group) => (
            <div key={group.group} className="mb-8">
              <h3 className="text-[9px] font-black text-slate-600 mb-4 px-4 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/10 rounded-full" /> {group.group}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path} to={item.path} end={item.path === "/me"} 
                    className={({ isActive }) => 
                      `flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 border-l-2 ${
                        isActive ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_20px_rgba(255,130,0,0.1)]' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="transition-all group-hover:text-orange-500 group-hover:scale-110">{item.icon}</span>
                      <span className="text-[12.5px] font-bold uppercase tracking-wide">{item.name}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" />
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* =========================================
          VERSION MOBILE (BOTTOM NAV BAR)
          ========================================= */}
      
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full h-20 bg-[#020617] border-t border-white/10 z-[9999] flex items-center justify-around px-4 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <MobileTab to="/me" icon={<Home size={24} />} label="Accueil" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileTab to="/mes-demandes" icon={<FileText size={24} />} label="Docs" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileTab to="/urgence-sante" icon={<Activity size={24} />} label="Urgence" onClick={() => setIsMobileMenuOpen(false)} />
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-colors ${isMobileMenuOpen ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </nav>

      {/* Menu Mobile Étendu */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990]"
        />
      )}

      <div className={`md:hidden fixed inset-x-0 bottom-20 top-10 z-[9995] bg-[#020617] border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-y-auto custom-scrollbar transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        <div className="w-full flex justify-center pt-5 pb-3 shrink-0">
            <div className="w-16 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="p-6 pb-24 space-y-8 flex-1">
          {citizenMenuItems.map((group) => (
            <div key={group.group}>
              <h3 className="text-[11px] font-black text-orange-500/80 mb-4 uppercase tracking-[0.2em]">{group.group}</h3>
              <div className="grid grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path} to={item.path} end={item.path === "/me"} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl border ${
                        isActive ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-slate-900 border-white/5 text-slate-300 active:bg-slate-800'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 130, 0, 0.2); border-radius: 10px; }
      `}</style>
    </>
  );
};

const MobileTab = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <NavLink 
    to={to} end={to === "/me"} onClick={onClick}
    className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all ${
      isActive ? 'text-orange-500 -translate-y-1' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </NavLink>
);

export default CitizenSidebar;