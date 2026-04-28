import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Shield, Users, Crosshair, Fingerprint, LogOut, ChevronRight, Server, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAuth } from "../../hooks/useAuth";

export default function PoliceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'PO';

  const menuItems = [
    { name: "QG Opérationnel", path: "/portail/police", icon: <Activity size={18} />, exact: true },
    { name: "Unités & Effectifs", path: "/portail/police/agents", icon: <Users size={18} /> },
    { name: "Fichier Criminel", path: "/portail/police/fichier", icon: <Fingerprint size={18} /> },
    { name: "Déploiement Tactique", path: "/portail/police/tactique", icon: <Crosshair size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
      
      <aside className="w-[300px] bg-[#050914] border-r border-blue-500/20 flex flex-col p-6 relative z-20 shadow-2xl">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-cyan-400 to-transparent opacity-50 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

        <div className="mb-10 mt-2 px-2 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase italic tracking-tighter leading-tight">
              Portail <span className="text-blue-500">Police</span>
            </h2>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mt-0.5">
              Réseau Sécurisé
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                  isActive
                  ? "bg-blue-500/10 border border-blue-500/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                  : "hover:bg-white/5 text-slate-400 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={isActive ? "text-cyan-400" : "text-slate-600 group-hover:text-blue-400/70 transition-colors"}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <motion.div layoutId="activePoliceIndicator">
                    <ChevronRight size={14} className="text-cyan-400" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-sm">
                {initials}
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase truncate max-w-[140px]">{user.name || 'Admin Police'}</p>
                <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Admin Police</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors justify-center group">
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
        <header className="shrink-0 z-50 bg-[#050914]/60 backdrop-blur-xl border-b border-blue-500/20 h-20 flex justify-between items-center px-8 shadow-md">
           <div className="flex items-center gap-2">
             <Shield size={16} className="text-blue-500" />
             <span className="text-xs font-black text-white uppercase tracking-widest">
               {user.name || 'Portail Police'}
             </span>
           </div>
           
           <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/30">
             <Server size={12} />
             <span>LIAISON RNPP : <span className="font-black text-white">CHIFFRÉE</span></span>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
}