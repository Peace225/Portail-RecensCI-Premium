// src/backoffice/Settings.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { 
  ShieldCheck, Lock, Wifi, Bell, 
  Save, RefreshCw, Cpu, ShieldAlert,
  Smartphone, Database, Clock
} from "lucide-react";
import { toast } from "react-hot-toast";

const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // États locaux typés pour le HUD
  const [config, setConfig] = useState({
    sessionTimeout: "15",
    syncInterval: "24",
    require2FA: true,
    emailAlerts: true,
    maintenanceMode: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulation d'écriture dans une table de configuration système
      // const { error } = await supabase.from('system_config').upsert([config]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Protocoles système mis à jour", {
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' },
        icon: <ShieldCheck className="text-emerald-500" />
      });
    } catch (error) {
      toast.error("Échec de la mise à jour des protocoles");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 relative z-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
            <Cpu className="text-orange-500" /> Paramètres <span className="text-orange-500">Noyau</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Configuration des variables de souveraineté numérique
          </p>
        </div>
        
        <div className="px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Système Opérationnel</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* --- SECTION 1: SÉCURITÉ ACCRÉDITÉE --- */}
        <SettingsCard title="Sécurité des Agents" icon={<Lock className="text-blue-400" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration Session (Min)</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="number" 
                  value={config.sessionTimeout}
                  onChange={(e) => setConfig({...config, sessionTimeout: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <p className="text-[8px] text-slate-600 uppercase font-bold tracking-tight">Verrouillage automatique après inactivité.</p>
            </div>

            <div className="space-y-4 pt-2">
              <ToggleRow 
                title="Double Authentification (A2F)" 
                desc="Obligatoire pour tous les accès agents terrain."
                active={config.require2FA}
                onClick={() => setConfig({...config, require2FA: !config.require2FA})}
                icon={<Smartphone size={16} />}
              />
            </div>
          </div>
        </SettingsCard>

        {/* --- SECTION 2: RÉSEAU & SYNC --- */}
        <SettingsCard title="Politique de Flux" icon={<Wifi className="text-orange-400" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Délai Max Hors-Ligne (Heures)</label>
              <div className="relative">
                <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="number" 
                  value={config.syncInterval}
                  onChange={(e) => setConfig({...config, syncInterval: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-orange-500 transition-all font-mono"
                />
              </div>
              <p className="text-[8px] text-slate-600 uppercase font-bold tracking-tight">Intervalle avant révocation du cache local.</p>
            </div>
          </div>
        </SettingsCard>

        {/* --- SECTION 3: ALERTES --- */}
        <SettingsCard title="Alertes Monitoring" icon={<Bell className="text-emerald-400" />}>
          <ToggleRow 
            title="Notifications de Doublons" 
            desc="Alerte immédiate en cas de NNI dupliqué sur le réseau."
            active={config.emailAlerts}
            onClick={() => setConfig({...config, emailAlerts: !config.emailAlerts})}
            icon={<ShieldAlert size={16} />}
          />
        </SettingsCard>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex justify-end items-center gap-6 pt-10 border-t border-white/5">
          <button type="button" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            Réinitialiser
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-10 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl shadow-orange-600/20 active:scale-95"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? "Synchronisation..." : "Appliquer les Protocoles"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- SOUS-COMPOSANT : CARTE HUD ---
const SettingsCard = ({ title, icon, children }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl"
  >
    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg border border-white/10">{icon}</div>
      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">{title}</h3>
    </div>
    <div className="p-10">{children}</div>
  </motion.div>
);

// --- SOUS-COMPOSANT : LIGNE TOGGLE ---
const ToggleRow = ({ title, desc, active, onClick, icon }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-start gap-4">
      <div className={`mt-1 p-2 rounded-lg transition-colors ${active ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-800 text-slate-600'}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black text-white uppercase tracking-wider">{title}</h4>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1">{desc}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ${active ? 'bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-slate-800'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${active ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  </div>
);

export default Settings;