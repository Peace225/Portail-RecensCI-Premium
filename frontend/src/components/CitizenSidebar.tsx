import React from "react";
import { NavLink } from "react-router-dom";
import { 
  User, FileText, Bell, HelpCircle, LogOut, 
  ChevronRight, ShieldCheck, Home, Users, 
  Baby, Heart, Skull, MapPin
} from "lucide-react";

// Structure des menus avec groupes
const citizenMenuItems = [
  {
    group: "1. Recensement & Population",
    items: [
     { name: "Mon Profil & Ménage", path: "/me", icon: <Home size={20} /> },
      { name: "Renseignements complets", path: "/recensement-details", icon: <Users size={20} /> },
      { name: "Changement d'adresse", path: "/migrations", icon: <MapPin size={20} /> },
      { name: "Prestations & Droits", path: "/prestations", icon: <ShieldCheck size={20} /> },
    ]
  },
  {
    group: "2. État Civil (Déclarations)",
    items: [
      { name: "Déclarer une naissance", path: "/declarer-naissance", icon: <Baby size={20} /> },
      { name: "Mariage ou Divorce", path: "/declarer-statut", icon: <Heart size={20} /> },
      { name: "Déclarer un décès", path: "/declarer-deces", icon: <Skull size={20} /> },
      { name: "Mes documents officiels", path: "/mes-demandes", icon: <FileText size={20} /> },
    ]
  },
  {
    group: "Assistance & Alertes",
    items: [
      { name: "Notifications", path: "/notifications", icon: <Bell size={20} /> },
      { name: "Centre d'aide SOS", path: "/aide", icon: <HelpCircle size={20} /> },
    ]
  }
];

const CitizenSidebar: React.FC = () => {
  return (
    <aside className="w-72 min-w-[288px] shrink-0 bg-white text-slate-600 h-screen flex flex-col border-r border-slate-100 shadow-xl shadow-slate-200/10 relative z-50 font-sans">
      
      {/* HEADER LOGO - Design Premium */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
            <span className="font-black text-xl text-white italic">R</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter flex items-center text-slate-900">
              RECENS<span className="text-orange-600">CI</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight italic">Espace Citoyen</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION - Liste scrollable */}
      <nav className="flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar pb-6">
        {citizenMenuItems.map((group) => (
          <div key={group.group} className="mb-6">
            <h3 className="text-[10px] font-black text-slate-300 mb-3 px-4 uppercase tracking-[0.2em]">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  // "end" empêche le profil d'être actif quand on est sur une sous-page
                  end={item.path === "/me"} 
                  className={({ isActive }) => 
                    `flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-orange-50 text-orange-600 shadow-sm shadow-orange-100/50' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="transition-transform group-hover:scale-110 duration-300">
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                  </div>
                  <ChevronRight 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" 
                  />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER - Statut de connexion sécurisée */}
      <div className="p-6 border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 mb-4 shadow-sm">
           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <ShieldCheck size={18} />
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Accès Sécurisé</p>
              <p className="text-[9px] text-emerald-500 font-bold uppercase italic">ID: Chef de Ménage</p>
           </div>
        </div>
        
        <button 
          onClick={() => {/* Logique de déconnexion ici */}}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default CitizenSidebar;