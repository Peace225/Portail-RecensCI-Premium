// src/components/CitizenSidebar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Import de useNavigate
import { useAuth } from "../hooks/useAuth"; // Import de ton hook d'auth
import { 
  FileText, Bell, HelpCircle, LogOut, 
  ChevronRight, ShieldCheck, Home, Users, 
  Baby, Heart, Skull, MapPin, Activity
} from "lucide-react";

const citizenMenuItems = [
  {
    group: "1. Recensement & Population",
    items: [
     { name: "Mon Profil & Ménage", path: "/me", icon: <Home size={18} /> },
      { name: "Renseignements complets", path: "/recensement-details", icon: <Users size={18} /> },
      { name: "Changement d'adresse", path: "/migrations", icon: <MapPin size={18} /> },
      { name: "Prestations & Droits", path: "/prestations", icon: <ShieldCheck size={18} /> },
    ]
  },
  {
    group: "2. État Civil (Déclarations)",
    items: [
      { name: "Déclarer une naissance", path: "/declarer-naissance", icon: <Baby size={18} /> },
      { name: "Mariage ou Divorce", path: "/declarer-statut", icon: <Heart size={18} /> },
      { name: "Déclarer un décès", path: "/declarer-deces", icon: <Skull size={18} /> },
      { name: "Mes documents officiels", path: "/mes-demandes", icon: <FileText size={18} /> },
    ]
  },
  {
    group: "Assistance & Alertes",
    items: [
      { name: "Notifications", path: "/notifications", icon: <Bell size={18} /> },
      { name: "Centre d'aide SOS", path: "/aide", icon: <HelpCircle size={18} /> },
    ]
  }
];

const CitizenSidebar: React.FC = () => {
  const { logout } = useAuth(); // Récupération de la fonction de déconnexion
  const navigate = useNavigate(); // Hook pour la redirection

 // LOGIQUE DE DÉCONNEXION SYSTÈME
  const handleLogout = async () => {
    try {
      // On demande juste la déconnexion, le ProtectedRoute va s'occuper de 
      // te jeter dehors et de te ramener sur /login automatiquement.
      await logout(); 
    } catch (error) {
      console.error("Échec de la fermeture de session sécurisée", error);
    }
  };

  return (
    <aside className="w-72 min-w-[288px] shrink-0 bg-[#020617] text-slate-400 h-screen flex flex-col border-r border-white/5 relative z-50 font-sans overflow-hidden">
      
      {/* --- EFFET DE GRILLE NUMÉRIQUE --- */}
      <div className="absolute inset-0 opacity-5 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* HEADER LOGO */}
      <div className="p-8 mb-2 relative">
        <div className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-orange-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-11 h-11 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
              <span className="font-black text-xl text-white italic z-10">R</span>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent h-[200%] w-full animate-[scan_3s_linear_infinite]" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter flex items-center text-white">
              RECENS<span className="text-[#FF8200] italic drop-shadow-[0_0_8px_rgba(255,130,0,0.4)]">CI</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">Espace Citoyen</p>
              <span className="flex h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION - Liste HUD */}
      <nav className="flex-1 overflow-y-auto px-4 mt-2 custom-scrollbar pb-6 relative z-10">
        {citizenMenuItems.map((group) => (
          <div key={group.group} className="mb-8">
            <h3 className="text-[9px] font-black text-slate-600 mb-4 px-4 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full" /> {group.group}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/me"} 
                  className={({ isActive }) => 
                    `flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300 border-l-2 ${
                      isActive 
                        ? 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_20px_rgba(255,130,0,0.1)]' 
                        : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="transition-all group-hover:text-orange-500 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="text-[12.5px] font-bold tracking-tight uppercase tracking-wide">{item.name}</span>
                  </div>
                  <ChevronRight 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-500" 
                  />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER - HUD Securité & Logout */}
      <div className="p-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 group hover:border-emerald-500/30 transition-colors">
           <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:animate-pulse">
              <ShieldCheck size={20} />
           </div>
           <div className="flex-1">
              <p className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1">Session Cryptée</p>
              <div className="flex items-center gap-2">
                 <p className="text-[8px] text-emerald-500 font-mono uppercase font-bold">AES-512 ACTIVE</p>
              </div>
           </div>
        </div>
        
        {/* BOUTON CONNECTÉ À HANDLELOGOUT */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-transparent hover:border-red-500/20 active:scale-95"
        >
          <LogOut size={16} /> Déconnexion Système
        </button>
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
    </aside>
  );
};

export default CitizenSidebar;