// src/backoffice/BackofficeDashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShieldHalf, Users, Activity, UserPlus, Settings, 
  Search, ShieldAlert, LayoutDashboard, ArrowLeft, 
  DatabaseBackup, Key
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Données factices ---
type Agent = { id: string; name: string; matricule: string; role: string; status: "Actif" | "Suspendu"; lastLogin: string };

const mockAgents: Agent[] = [
  { id: "1", name: "Brad Admin", matricule: "ADM-001", role: "Super_Admin", status: "Actif", lastLogin: "Aujourd'hui, 08:30" },
  { id: "2", name: "Kouadio Jean", matricule: "OEC-452", role: "Officier_Etat_Civil", status: "Actif", lastLogin: "Aujourd'hui, 09:15" },
  { id: "3", name: "Bamba Mariam", matricule: "MED-890", role: "Agent_Sante", status: "Actif", lastLogin: "Hier, 14:20" },
  { id: "4", name: "Kone Seydou", matricule: "POL-112", role: "Officier_Police", status: "Suspendu", lastLogin: "Il y a 3 jours" },
];

const BackofficeDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<"VUE_ENSEMBLE" | "AGENTS" | "LOGS" | "SECURITE">("AGENTS");
  const navigate = useNavigate();

  const handleCreateAgent = () => toast.success("Module d'enrôlement Agent bientôt disponible.");

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* 1. LA NOUVELLE SIDEBAR (EXCLUSIVE ADMIN)   */}
      {/* ========================================== */}
      <aside className="w-72 min-w-[288px] bg-[#020617] text-slate-300 h-screen flex flex-col border-r border-indigo-900/30 shadow-2xl relative z-50">
        
        {/* LOGO ADMIN */}
        <div className="p-8 mb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <ShieldHalf size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white flex items-center">
                RECENS<span className="text-indigo-500 underline decoration-2 underline-offset-4">CI</span>
              </h1>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest leading-tight">Portail Administrateur</p>
            </div>
          </div>
        </div>

        {/* MENU ADMIN */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <h3 className="text-[10px] font-black text-slate-600 mb-4 px-4 uppercase tracking-[0.2em]">Supervision</h3>
          
          <MenuButton active={activeMenu === "VUE_ENSEMBLE"} onClick={() => setActiveMenu("VUE_ENSEMBLE")} icon={<LayoutDashboard size={18} />} label="Tableau de Bord" />
          <MenuButton active={activeMenu === "AGENTS"} onClick={() => setActiveMenu("AGENTS")} icon={<Users size={18} />} label="Gestion des Accès" />
          <MenuButton active={activeMenu === "LOGS"} onClick={() => setActiveMenu("LOGS")} icon={<Activity size={18} />} label="Logs & Audit" />
          
          <h3 className="text-[10px] font-black text-slate-600 mb-4 mt-8 px-4 uppercase tracking-[0.2em]">Système</h3>
          
          <MenuButton active={activeMenu === "SECURITE"} onClick={() => setActiveMenu("SECURITE")} icon={<Key size={18} />} label="Sécurité & Clés" />
          <MenuButton active={false} onClick={() => toast.success("Sauvegarde lancée.")} icon={<DatabaseBackup size={18} />} label="Sauvegarde Base" />
        </nav>

        {/* RETOUR AU PORTAIL */}
        <div className="p-4 border-t border-white/5 bg-[#030712]">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-800/50 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest border border-slate-700 hover:border-indigo-500"
          >
            <ArrowLeft size={16} /> Retour au Portail
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* 2. LA ZONE DE CONTENU (RIGHT SIDE)         */}
      {/* ========================================== */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto p-8 md:p-12">
          
          {/* HEADER DYNAMIQUE */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                {activeMenu === "AGENTS" ? "Habilitations & Accès" : activeMenu === "LOGS" ? "Journal d'Audit" : "Centre de Commandement"}
              </h2>
              <p className="text-indigo-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Niveau de sécurité maximal</p>
            </div>
            <div className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Serveur Actif
            </div>
          </div>

          {/* RENDU DYNAMIQUE SELON LE MENU */}
          {activeMenu === "AGENTS" && (
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50">
                <div className="relative w-full md:w-96">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Rechercher un agent..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-700" />
                </div>
                <button onClick={handleCreateAgent} className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  <UserPlus size={16} /> Enrôler un Agent
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="p-6 font-black">Agent & Matricule</th>
                      <th className="p-6 font-black">Habilitation (Rôle)</th>
                      <th className="p-6 font-black">Statut</th>
                      <th className="p-6 font-black">Dernière Connexion</th>
                      <th className="p-6 font-black text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold text-slate-700">
                    {mockAgents.map((agent) => (
                      <tr key={agent.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-100">
                              {agent.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-slate-900">{agent.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{agent.matricule}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] uppercase tracking-widest">{agent.role.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-2 w-fit ${agent.status === 'Actif' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Actif' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            {agent.status}
                          </span>
                        </td>
                        <td className="p-6 text-slate-400 font-medium text-xs">{agent.lastLogin}</td>
                        <td className="p-6 text-center">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Settings size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMenu === "LOGS" && (
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none"><Activity size={250} /></div>
              <div className="space-y-4 relative z-10">
                <LogItem action="Création Acte de Naissance" target="N° NAI-2026-45" agent="OEC-452" time="Il y a 10 min" type="success" />
                <LogItem action="Modification Fiche Recensement" target="NNI 83749202" agent="ADM-001" time="Il y a 1 heure" type="warning" />
                <LogItem action="Tentative de connexion échouée" target="IP: 192.168.1.4" agent="Inconnu" time="Il y a 3 heures" type="danger" />
                <LogItem action="Exportation Dataset INS" target="Mortalité Maternelle" agent="ADM-001" time="Hier" type="info" />
              </div>
            </div>
          )}

          {/* Vue d'ensemble simple */}
          {activeMenu === "VUE_ENSEMBLE" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard icon={<Users size={24} />} title="Agents Enregistrés" value="1,245" color="text-indigo-500" bg="bg-indigo-50" />
              <StatCard icon={<Activity size={24} />} title="Opérations (24h)" value="8,932" color="text-emerald-500" bg="bg-emerald-50" />
              <StatCard icon={<ShieldAlert size={24} />} title="Alertes Sécurité" value="3" color="text-red-500" bg="bg-red-50" />
            </div>
          )}

        </div>
      </main>

    </div>
  );
};

// --- MINI-COMPOSANTS INTERNES ---
const MenuButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ icon, title, value, color, bg }: any) => (
  <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${bg} ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const LogItem = ({ action, target, agent, time, type }: any) => {
  const colors = {
    success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    warning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    danger: "text-red-400 bg-red-400/10 border-red-400/20",
    info: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-800 border border-slate-700 rounded-2xl gap-4 hover:border-slate-500 transition-colors">
      <div>
        <p className="text-sm font-bold text-white">{action}</p>
        <p className="text-xs text-slate-400 mt-1">Cible: <span className="text-slate-300 font-medium">{target}</span></p>
      </div>
      <div className="flex items-center gap-6">
        <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest border font-black ${colors[type as keyof typeof colors]}`}>Auteur: {agent}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{time}</span>
      </div>
    </div>
  );
};

export default BackofficeDashboard;