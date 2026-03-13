// src/pages/Settings.tsx
import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  ShieldAlert, 
  Key, 
  DatabaseBackup, 
  ToggleRight, 
  ToggleLeft, 
  Server, 
  GlobeLock,
  Bell
} from "lucide-react";
import { toast } from "react-hot-toast";

const Settings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Paramètres Système</h2>
          <p className="text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Configuration de la plateforme RecensCI</p>
        </div>
        <div className="bg-slate-100 border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
           <div className={`w-2 h-2 rounded-full animate-pulse ${maintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'}`}></div> 
           {maintenanceMode ? "Maintenance" : "Serveur Actif"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : Configurations Générales */}
        <div className="space-y-8">
          
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>
            
            <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner">
                <Server size={18} />
              </span>
              État du Serveur & Accès
            </h3>

            <div className="space-y-6 relative z-10">
              {/* Toggle Maintenance */}
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-slate-300 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-800">Mode Maintenance</p>
                  <p className="text-xs text-slate-500 mt-1">Bloque l'accès aux agents (sauf Admin).</p>
                </div>
                <button 
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    toast(maintenanceMode ? "Système en ligne" : "Mode maintenance activé", { icon: maintenanceMode ? "🟢" : "⚠️" });
                  }}
                  className={`transition-colors ${maintenanceMode ? "text-amber-500" : "text-slate-300 hover:text-slate-400"}`}
                >
                  {maintenanceMode ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>

              {/* Toggle 2FA */}
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-slate-300 transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-800">Authentification 2FA</p>
                  <p className="text-xs text-slate-500 mt-1">Force les agents à utiliser un code SMS/Email.</p>
                </div>
                <button 
                  onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                  className={`transition-colors ${twoFactorAuth ? "text-emerald-500" : "text-slate-300 hover:text-slate-400"}`}
                >
                  {twoFactorAuth ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <h3 className="text-xs font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Bell size={18} />
              </span>
              Notifications
            </h3>
            
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-800">Rapports d'activité (Email)</p>
                <p className="text-xs text-slate-500 mt-1">Recevoir un résumé des enrôlements chaque soir.</p>
              </div>
              <button 
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`transition-colors ${emailNotifications ? "text-blue-600" : "text-slate-300"}`}
              >
                {emailNotifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
              </button>
            </div>
          </div>

        </div>

        {/* COLONNE DROITE : API & Base de données */}
        <div className="space-y-8">
          
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
               <GlobeLock size={200} />
            </div>
            
            <h3 className="text-xs font-black text-indigo-400 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <Key size={18} /> Intégrations & API
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Clé API Registre ONECI</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="password" value="sk_live_oneci_89237498237498234" readOnly className="w-full p-4 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-mono text-sm outline-none" />
                  <button onClick={() => toast.success("Clé API copiée !")} className="px-8 py-4 sm:py-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition-colors shrink-0 uppercase tracking-widest">Copier</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Passerelle Interpol (Frontières)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="password" value="int_pol_conn_2938472938" readOnly className="w-full p-4 bg-slate-800 border border-slate-700 text-slate-300 rounded-2xl font-mono text-sm outline-none" />
                  <button onClick={() => toast.success("Clé API copiée !")} className="px-8 py-4 sm:py-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-xs transition-colors shrink-0 uppercase tracking-widest">Copier</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 flex flex-col justify-between items-center text-center">
            <DatabaseBackup size={48} className="text-emerald-500 mb-4" />
            <h3 className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-2">Sauvegarde Manuelle</h3>
            <p className="text-xs text-emerald-600/80 font-bold mb-6">Générer une image complète de la base de données Firestore.</p>
            <button 
              onClick={() => toast.success("Processus de sauvegarde Cloud démarré...")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 uppercase tracking-widest text-xs transition-all"
            >
              Lancer le Backup
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;