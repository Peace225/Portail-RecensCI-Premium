import React, { useState } from "react";
import { NavLink } from "react-router-dom"; 
import { useSelector } from "react-redux"; 
import { RootState } from "../../../store"; 
import { 
  Landmark, Users, FileText, Settings, 
  ChevronRight, Menu, X, BarChart3
} from "lucide-react";

const mairieMenuItems = [
  {
    group: "Pilotage & Finances",
    items: [
      { name: "Tableau de bord", path: "/portail/mairie", icon: <BarChart3 size={18} /> },
      { name: "Recettes & Taxes", path: "/portail/mairie/finances", icon: <Landmark size={18} /> },
    ]
  },
  {
    group: "Administration",
    items: [
      { name: "Départements", path: "/portail/mairie/departements", icon: <FileText size={18} /> },
      { name: "Gestion des Agents", path: "/portail/mairie/agents", icon: <Users size={18} /> },
    ]
  },
  {
    group: "Système",
    items: [
      { name: "Paramètres", path: "/portail/mairie/parametres", icon: <Settings size={18} /> },
    ]
  }
];

const MairieSidebar: React.FC = () => {
  // 👉 1. On récupère la photo, le nom et la commune en temps réel
  const { name, photoUrl, commune } = useSelector((state: RootState) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 👉 2. Récupération dynamique de la commune
  const communeName = (commune && commune !== "Inconnue") 
    ? commune 
    : (localStorage.getItem('commune_secours') || "Inconnue");

  return (
    <>
      {/* =========================================
          VERSION DESKTOP
          ========================================= */}
      <aside className="hidden md:flex w-72 min-w-[288px] shrink-0 bg-[#020617] text-slate-400 h-screen flex-col border-r border-white/5 relative z-50 font-sans overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="p-8 mb-2 relative">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-amber-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              
              {/* 👉 3. AFFICHAGE DE LA PHOTO DE PROFIL OU DES INITIALES */}
              <div className="relative w-11 h-11 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-amber-500 font-black text-sm uppercase tracking-tighter">
                    {name ? name.substring(0, 2) : "AD"}
                  </span>
                )}
              </div>

            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-[13px] font-black tracking-tighter text-white uppercase truncate">
                {name || "MAIRIE ADMIN"}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-[8px] font-black text-amber-500/80 uppercase tracking-widest leading-tight truncate">
                   {communeName !== "Inconnue" ? `Mairie de ${communeName}` : "Portail Institutionnel"}
                </p>
                <span className="flex shrink-0 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar pb-6 relative z-10">
          {mairieMenuItems.map((group) => (
            <div key={group.group} className="mb-8">
              <h3 className="text-[9px] font-black text-slate-600 mb-4 px-4 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/10 rounded-full" /> {group.group}
              </h3>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path} 
                    to={item.path} 
                    end={item.path === "/portail/mairie"} // "end" uniquement pour la racine du dashboard
                    className={({ isActive }) => 
                      `flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 border-l-2 ${
                        isActive ? 'bg-amber-500/10 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span className="transition-all group-hover:text-amber-500 group-hover:scale-110">{item.icon}</span>
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
        <MobileTab to="/portail/mairie" icon={<BarChart3 size={24} />} label="Dash" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileTab to="/portail/mairie/departements" icon={<FileText size={24} />} label="Départs" onClick={() => setIsMobileMenuOpen(false)} />
        <MobileTab to="/portail/mairie/agents" icon={<Users size={24} />} label="Agents" onClick={() => setIsMobileMenuOpen(false)} />
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-colors ${isMobileMenuOpen ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </nav>

      {/* Menu Étendu Mobile */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990]" />
      )}

      <div className={`md:hidden fixed inset-x-0 bottom-20 top-10 z-[9995] bg-[#020617] border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-y-auto custom-scrollbar transition-transform duration-300 ease-out flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-full flex justify-center pt-5 pb-3 shrink-0"><div className="w-16 h-1.5 bg-white/20 rounded-full" /></div>
        
        {/* En-tête du menu mobile avec Photo */}
        <div className="flex items-center gap-4 px-6 pb-6 border-b border-white/5">
          <div className="w-12 h-12 bg-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-center overflow-hidden">
             {photoUrl ? (
                <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
             ) : (
                <span className="text-amber-500 font-black text-sm uppercase">{name ? name.substring(0, 2) : "AD"}</span>
             )}
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase">{name || "MAIRIE ADMIN"}</h1>
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1">
              {communeName !== "Inconnue" ? `Mairie de ${communeName}` : "Portail Institutionnel"}
            </p>
          </div>
        </div>

        <div className="p-6 pb-24 space-y-8 flex-1">
          {mairieMenuItems.map((group) => (
            <div key={group.group}>
              <h3 className="text-[11px] font-black text-amber-500/80 mb-4 uppercase tracking-[0.2em]">{group.group}</h3>
              <div className="grid grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path} to={item.path} end={item.path === "/portail/mairie"} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl border ${
                        isActive ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-900 border-white/5 text-slate-300 active:bg-slate-800'
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
    </>
  );
};

const MobileTab = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <NavLink 
    to={to} end={to === "/portail/mairie"} onClick={onClick}
    className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full gap-1.5 transition-all ${
      isActive ? 'text-amber-500 -translate-y-1' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </NavLink>
);

export default MairieSidebar;