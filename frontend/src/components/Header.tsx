// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { 
  LogOut, User, Menu, X, Zap, LayoutDashboard,
  ShieldCheck, Activity, Sparkles, ArrowRight, Cpu
} from "lucide-react";

// --- ANIMATIONS CSS ---
const styles = `
  @keyframes scan { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(100%); opacity: 0; } }
  .animate-scan-line { animation: scan 3s linear infinite; }
  .cyber-grid-bg {
    background-image: linear-gradient(to right, rgba(255,130,0,0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,130,0,0.05) 1px, transparent 1px);
    background-size: 30px 30px;
  }
`;

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { role } = useSelector((state: RootState) => state.user);

  // 👉 1. LOGIQUE DE VISIBILITÉ : On liste les pages où le logo/menu classique doit apparaître
  const publicPages = ['/', '/stats', '/login', '/register', '/aide'];
  const isPublicRoute = publicPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      navigate('/backoffice');
    } else if (role === 'ENTITY_ADMIN') {
      navigate('/portail/mairie'); 
    } else if (role === 'AGENT' || role === 'DEPT_HEAD' || role === 'SERVICE_HEAD') {
      navigate('/dashboard');
    } else {
      navigate('/me'); 
    }
  };

  return (
    <>
      <style>{styles}</style>

      <header className={`fixed top-6 z-[110] w-full transition-all duration-500 ${
        scrolled || isMenuOpen
        ? "py-3 bg-slate-950 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]" 
        : "py-6 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10">
          
          {/* LOGO GAUCHE : Flex-1 maintient l'espace même si le logo est caché */}
          <div className="flex-1">
            {isPublicRoute && (
              <Link to="/" className="inline-flex items-center gap-4 group relative z-[130]">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-12 h-10 md:w-14 md:h-12 bg-slate-900 border border-white/10 flex items-center justify-center rounded-sm overflow-hidden p-1 shadow-inner">
                    <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain filter brightness-110" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent h-[150%] w-full animate-scan-line pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
                    RECENS<span className="text-[#FF8200] drop-shadow-[0_0_10px_#FF8200]">CI</span>
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase">Souveraineté Digitale</span>
                </div>
              </Link>
            )}
          </div>

          {/* NAVIGATION ET BOUTONS (Droite) */}
          <div className="hidden lg:flex items-center gap-10 relative z-[130] justify-end">
            
            {/* On cache aussi les liens d'accueil/stats si on est dans un dashboard */}
            {isPublicRoute && (
              <nav className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Link to="/" className="hover:text-white transition-colors border-b-2 border-orange-500 pb-1 text-white">Accueil</Link>
                <Link to="/stats" className="hover:text-white transition-colors flex items-center gap-2">
                  Statistiques <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                </Link>
                <Link to="/aide" className="hover:text-white transition-colors flex items-center gap-2">
                  Support IA <Sparkles size={12} className="text-blue-400 animate-pulse" />
                </Link>
              </nav>
            )}

            {isPublicRoute && <div className="h-8 w-[1px] bg-white/10"></div>}

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button onClick={handleProfileClick} className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group shadow-lg">
                     {user.photoUrl ? (
                       <img src={user.photoUrl} alt="Profil" className="w-10 h-10 rounded-full object-cover border border-orange-500 shadow-[0_0_10px_#ea580c]" />
                     ) : (
                       <User size={16} className="text-orange-500" />
                     )}
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">
                       {role === 'ENTITY_ADMIN' ? 'Maire' : user.name?.split(' ')[0]}
                     </span>
                  </button>

                  <button onClick={handleLogout} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl transition-all active:scale-95" title="Déconnexion">
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Connexion</Link>
                  <Link to="/login" className="group relative px-8 py-3 bg-orange-600 overflow-hidden rounded-md border border-orange-400/50 shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:bg-orange-500 transition-colors">
                    <span className="relative z-10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      S'enregistrer <Zap size={14} fill="currentColor" />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative z-[130] p-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all active:scale-90"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* --- MENU MOBILE --- */}
      <div className={`fixed inset-0 z-[105] bg-slate-950 transition-all duration-500 lg:hidden ${
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}>
        <div className="absolute inset-0 cyber-grid-bg opacity-10" />
        <div className="relative z-10 h-full flex flex-col pt-36 px-8 gap-8 items-center text-center overflow-y-auto pb-10">
          <nav className="flex flex-col gap-5 w-full max-w-sm">
            {isPublicRoute && (
              <>
                <MobileLink to="/" label="Initialisation / Accueil" icon={<Activity size={20} />} onClick={() => setIsMenuOpen(false)} />
                <MobileLink to="/stats" label="Statistiques Live" icon={<LayoutDashboard size={20} />} isLive onClick={() => setIsMenuOpen(false)} />
                <MobileLink to="/aide" label="Assistant IA Holo" icon={<Sparkles size={20} />} onClick={() => setIsMenuOpen(false)} />
                <div className="h-px w-full bg-white/5 my-4" />
              </>
            )}

            {user ? (
              <>
                <button onClick={() => { handleProfileClick(); setIsMenuOpen(false); }} className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-left">
                  <div className="flex items-center gap-4">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="Profil" className="w-8 h-8 rounded-full object-cover border-2 border-orange-500 shadow-[0_0_10px_#ea580c]" />
                    ) : (
                      <User size={20} className="text-orange-500" />
                    )}
                    {role === 'ENTITY_ADMIN' ? 'Tableau de Bord' : 'Mon Espace'}
                  </div>
                  <ArrowRight size={20} className="text-slate-500" />
                </button>
                
                <button onClick={handleLogout} className="flex items-center justify-between p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest active:scale-95 transition-all">
                  Déconnexion <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest">
                  Accès Portail <Cpu size={20} className="text-slate-500" />
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-6 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest shadow-[0_0_30px_rgba(234,88,12,0.4)]">
                  S'ENREGISTRER <Zap fill="white" size={20} />
                </Link>
              </>
            )}
          </nav>

          <div className="mt-auto pt-10 w-full max-w-sm">
             <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-left">
                <ShieldCheck className="text-emerald-500" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Noeud Sécurisé Actif</span>
                  <span className="text-[8px] text-slate-600 font-mono italic uppercase tracking-tighter">Encodage: AES-512-GCM</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- SOUS-COMPOSANT LIEN MOBILE ---
const MobileLink = ({ to, label, icon, isLive, onClick }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all group"
  >
    <div className="flex items-center gap-4 uppercase text-xs font-black tracking-widest">
      <span className="text-orange-500 group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </div>
    {isLive ? (
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
    ) : (
      <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
    )}
  </Link>
);

export default Header;