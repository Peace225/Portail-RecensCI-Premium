// src/layouts/BackofficeLayout.tsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Settings, ShieldAlert, LogOut, ChevronRight,
  Database, Map, BadgeCheck, UserCircle, Eye, Cpu, Activity, 
  UserPlus, Users, MapPin, Send, Video, Flame, BellRing, Lock, 
  Crosshair, Box, BarChart2,
  // 👉 NOUVELLES ICÔNES (Système & Core)
  Server, HardDrive, Network, Rocket, Terminal, History, AlertOctagon, 
  Sliders, Key, Webhook, Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BackofficeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // On ouvre tous les menus par défaut pour que tu voies l'arborescence complète
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    '/backoffice/agents', 
    '/backoffice/citoyen',
    '/backoffice/surveillance',
    '/backoffice/zones',
    '/backoffice/technique',
    '/backoffice/logs',
    '/backoffice/settings'
  ]);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  // STRUCTURE ULTRA PRO : L'architecture complète de l'Hyperviseur
  const menuGroups = [
    {
      title: "Gouvernance & RH",
      items: [
        { name: "Hyperviseur Global", path: "/backoffice", icon: <LayoutDashboard size={18} /> },
        { 
          name: "1. Accréditation Agents", 
          path: "/backoffice/agents", 
          icon: <BadgeCheck size={18} />,
          subItems: [
            { name: "Nouvel Agent", path: "/backoffice/agents/add", icon: <UserPlus size={14} /> },
            { name: "Tous les Agents", path: "/backoffice/agents/list", icon: <Users size={14} /> },
            { name: "Données Terrain", path: "/backoffice/agents/data", icon: <MapPin size={14} /> },
            { name: "Messagerie Ops", path: "/backoffice/agents/messages", icon: <Send size={14} /> },
          ]
        },
        { 
          name: "2. Portail Citoyen", 
          path: "/backoffice/citoyen", 
          icon: <UserCircle size={18} />,
          subItems: [
            { name: "Flux en Direct", path: "/backoffice/citoyen/flux", icon: <Activity size={14} /> },
            { name: "Base de Données", path: "/backoffice/citoyen/database", icon: <Database size={14} /> },
            { name: "Centre Validation", path: "/backoffice/citoyen/validation", icon: <ShieldAlert size={14} /> },
          ]
        },
      ]
    },
    {
      title: "Opérations Sécurisées",
      items: [
        { 
          name: "3. Mode Surveillance", 
          path: "/backoffice/surveillance", 
          icon: <Eye size={18} />,
          subItems: [
            { name: "Flux Vidéo Live", path: "/backoffice/surveillance/video", icon: <Video size={14} /> },
            { name: "Heatmap Incidents", path: "/backoffice/surveillance/heatmap", icon: <Flame size={14} /> },
            { name: "Alertes & SOS", path: "/backoffice/surveillance/alertes", icon: <BellRing size={14} /> },
            { name: "Bouclier Cyber", path: "/backoffice/surveillance/cyber", icon: <Lock size={14} /> },
          ]
        },
        { 
          name: "Déploiement Terrain", 
          path: "/backoffice/zones", 
          icon: <Map size={18} />,
          subItems: [
            { name: "Zonage Secteurs", path: "/backoffice/zones/mapping", icon: <MapPin size={14} /> },
            { name: "Tracking GPS Live", path: "/backoffice/zones/tracking", icon: <Crosshair size={14} /> },
            { name: "Logistique Kits", path: "/backoffice/zones/logistique", icon: <Box size={14} /> },
            { name: "Rendement Zone", path: "/backoffice/zones/rendement", icon: <BarChart2 size={14} /> },
          ]
        },
      ]
    },
    {
      title: "Système & Core",
      items: [
        { 
          name: "4. Technique & DevOps", 
          path: "/backoffice/technique", 
          icon: <Cpu size={18} />,
          subItems: [
            { name: "Santé Serveurs", path: "/backoffice/technique/serveurs", icon: <Server size={14} /> },
            { name: "Clusters BDD", path: "/backoffice/technique/database", icon: <HardDrive size={14} /> },
            { name: "Passerelle API", path: "/backoffice/technique/api", icon: <Network size={14} /> },
            { name: "Déploiements", path: "/backoffice/technique/deployments", icon: <Rocket size={14} /> },
          ]
        },
        { 
          name: "Flux & Logs Réseau", 
          path: "/backoffice/logs", 
          icon: <Activity size={18} />,
          subItems: [
            { name: "Terminal Live", path: "/backoffice/logs/terminal", icon: <Terminal size={14} /> },
            { name: "Registre d'Audit", path: "/backoffice/logs/audit", icon: <History size={14} /> },
            { name: "Alertes Sécurité", path: "/backoffice/logs/security", icon: <AlertOctagon size={14} /> },
          ]
        },
        { 
          name: "5. Paramètres Système", 
          path: "/backoffice/settings", 
          icon: <Settings size={18} />,
          subItems: [
            { name: "Règles Métier & IA", path: "/backoffice/settings/rules", icon: <Sliders size={14} /> },
            { name: "Contrôle Accès IAM", path: "/backoffice/settings/iam", icon: <Key size={14} /> },
            { name: "Intégrations Ext.", path: "/backoffice/settings/integrations", icon: <Webhook size={14} /> },
            { name: "Interface & UI", path: "/backoffice/settings/display", icon: <Monitor size={14} /> },
          ]
        },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 overflow-hidden font-sans">
      
      {/* ==========================================
          SIDEBAR CYBER (MENU GAUCHE)
      ========================================== */}
      <aside className="w-[320px] bg-[#050914]/80 border-r border-white/5 backdrop-blur-2xl flex flex-col p-6 relative z-20">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-600 via-cyan-500 to-transparent opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

        {/* Logo / En-tête Sidebar */}
        <div className="mb-10 mt-2 px-2 flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/backoffice')}>
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
              Recens<span className="text-cyan-400">CI</span>
            </h2>
            <p className="text-[9px] font-black text-purple-500 uppercase tracking-[0.4em]">Core Admin</p>
          </div>
        </div>

        {/* Navigation Groupée */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 pl-4 border-l border-white/10 ml-2">
                {group.title}
              </h3>
              
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedMenus.includes(item.path);
                  
                  // Actif si on est sur la route exacte, ou sur un de ses sous-menus
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  const isStrictlyActive = item.path === '/backoffice' ? location.pathname === '/backoffice' : isActive;

                  return (
                    <div key={item.path} className="flex flex-col">
                      {/* BOUTON MENU PRINCIPAL */}
                      <button
                        onClick={() => hasSubItems ? toggleMenu(item.path) : navigate(item.path)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                          isStrictlyActive && !hasSubItems
                          ? "bg-purple-600/15 border border-purple-500/30 text-white shadow-lg" 
                          : "hover:bg-white/5 text-slate-400 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={isStrictlyActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-slate-600 group-hover:text-purple-400/70 transition-colors"}>
                            {item.icon}
                          </span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${isStrictlyActive ? 'text-white' : 'text-slate-400'}`}>
                            {item.name}
                          </span>
                        </div>
                        
                        {/* Gestion du chevron (Navigation ou Déroulant) */}
                        {hasSubItems ? (
                          <ChevronRight size={14} className={`text-slate-500 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-cyan-400' : ''}`} />
                        ) : isStrictlyActive ? (
                          <motion.div layoutId="activeIndicator">
                            <ChevronRight size={14} className="text-cyan-400" />
                          </motion.div>
                        ) : null}
                      </button>

                      {/* SOUS-MENUS (ACCORDÉON) */}
                      {hasSubItems && (
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.initial initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="pl-12 mt-1 space-y-1 border-l-2 border-white/5 ml-6 py-2 relative">
                                <div className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent" />
                                
                                {item.subItems.map((subItem) => {
                                  const isSubActive = location.pathname === subItem.path;
                                  return (
                                    <button
                                      key={subItem.path}
                                      onClick={() => navigate(subItem.path)}
                                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all ${
                                        isSubActive 
                                        ? "text-cyan-400 bg-white/5 font-black shadow-inner" 
                                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5 font-bold"
                                      }`}
                                    >
                                      <span className={isSubActive ? "text-cyan-400" : "text-slate-600"}>
                                        {subItem.icon}
                                      </span>
                                      <span className="text-[10px] uppercase tracking-widest">{subItem.name}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.initial>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="bg-[#020617] p-4 rounded-2xl border border-white/5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Noeud Central</span>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded">
                <span className="text-[8px] font-bold text-emerald-500 tracking-wider">ON</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
            <button className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors justify-center group">
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT AREA (ZONE DE DROITE)
      ========================================== */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-[#020617] to-[#020617]">
        
        {/* Top Header Bar */}
        <header className="shrink-0 z-50 bg-[#050914]/60 backdrop-blur-xl border-b border-white/5 h-20 flex justify-between items-center px-10 shadow-md">
           
           <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <Database size={14} className="text-cyan-500" />
              <span>DB_STATUS: <span className="text-emerald-400 font-black tracking-widest uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">Synchronisé</span></span>
           </div>
           
           <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-xs font-black text-white uppercase tracking-wider">Gael Kouhame</p>
                <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] mt-0.5">Superviseur Admin</p>
              </div>
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                   <div className="w-full h-full bg-[#020617] rounded-full border-2 border-transparent flex items-center justify-center overflow-hidden">
                      <span className="text-white font-black text-sm">GK</span>
                   </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#050914] rounded-full" />
              </div>
           </div>
        </header>

        {/* Conteneur dynamique des pages (Outlet) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BackofficeLayout;