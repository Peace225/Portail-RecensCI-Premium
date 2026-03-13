// src/components/Header.tsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  Menu, 
  Globe, 
  Zap,
  Building2
} from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Déterminer si on est sur la Landing Page (Sombre) ou dans le Dashboard (Clair)
  const isPublic = location.pathname === "/" || location.pathname === "/login";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={`sticky top-0 z-[100] w-full transition-all duration-500 ${
      isPublic 
      ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/5" 
      : "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
    }`}>
      {/* Barre d'accentuation aux couleurs de la Côte d'Ivoire (Orange, Blanc, Vert) */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF8200]" /> {/* Orange National */}
        <div className="bg-white" />      {/* Blanc */}
        <div className="bg-[#009E60]" /> {/* Vert National */}
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* --- LOGO GAUCHE AVEC ARMOIRIE --- */}
        <Link to="/" className="flex items-center gap-4 group">
          {/* Zone Armoirie/Logo stylisée */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#FF8200] to-[#009E60] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1.5 shadow-lg border border-slate-100">
              {/* REMPLACE CETTE ICÔNE PAR L'IMAGE DE L'ARMOIRIE DE LA CI (SVG/PNG) */}
              <Building2 className="w-full h-full text-[#FF8200]" strokeWidth={1.5} />
              {/* <img src="/path/to/armoirie_ci.svg" alt="Armoirie CI" className="w-full h-full object-contain" /> */}
            </div>
          </div>
          
          <div className="flex flex-col leading-none">
            <span className={`text-2xl font-black tracking-tighter ${isPublic ? 'text-white' : 'text-slate-900'}`}>
              Recens<span className="text-[#FF8200] italic">CI</span>
            </span>
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${isPublic ? 'text-slate-400' : 'text-slate-500'}`}>
              République de Côte d'Ivoire
            </span>
          </div>
        </Link>

        {/* --- NAVIGATION DROITE --- */}
        <div className="flex items-center gap-6">
          
          {/* Indicateur de Statut National (Opérationnel) */}
          <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl border ${
            isPublic 
            ? 'bg-white/5 border-white/10 text-slate-300' 
            : 'bg-[#009E60]/5 border-[#009E60]/10 text-[#009E60]'
          }`}>
            <div className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPublic ? 'bg-white' : 'bg-[#009E60]'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPublic ? 'bg-white' : 'bg-[#009E60]'}`}></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">
              Service d'État Certifié
            </span>
          </div>

          {/* USER ACTIONS (Connecté ou non) */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className={`text-sm font-black tracking-tight ${isPublic ? 'text-white' : 'text-slate-900'}`}>
                  {user?.displayName || user?.name || "Citoyen RNPP"}
                </span>
                <span className="text-[10px] text-[#FF8200] font-bold uppercase tracking-tighter italic">
                  {user?.role === "ADMIN" ? "Administrateur National" : "Identité Numérique Active"}
                </span>
              </div>
              
              {/* Raccourci vers le Profil (Style Premium) */}
              <Link 
                to="/me" 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isPublic 
                  ? 'bg-white/10 text-white hover:bg-[#FF8200] hover:shadow-lg hover:shadow-[#FF8200]/20' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white shadow-inner'
                }`}
              >
                <User size={22} />
              </Link>

              {/* Déconnexion */}
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Déconnexion sécurisée"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <Link to="/login" className={`text-[11px] font-black uppercase tracking-widest ${isPublic ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                  Connexion
               </Link>
               <Link to="/login" className="group px-8 py-4 bg-[#FF8200] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#FF8200]/20 hover:bg-[#FF8200]/90 transition-all active:scale-95 flex items-center gap-2">
                  S'enregistrer
                  <Zap size={14} className="group-hover:animate-pulse" />
               </Link>
            </div>
          )}
          
          {/* Mobile Menu (Caché sur desktop) */}
          <button className="md:hidden p-2 text-slate-400 hover:text-[#FF8200]">
            <Menu size={26} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;