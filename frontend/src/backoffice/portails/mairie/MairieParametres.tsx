import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, ShieldCheck, Database, Bell, Building2, 
  Save, Key, Smartphone, AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TABS = [
  { id: 'general', label: 'Général', icon: <Building2 size={16} /> },
  { id: 'security', label: 'Sécurité & Accès', icon: <ShieldCheck size={16} /> },
  { id: 'sync', label: 'Sync Hyperviseur', icon: <Database size={16} /> },
  { id: 'notifs', label: 'Alertes', icon: <Bell size={16} /> },
];

export default function MairieParametres() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Paramètres mis à jour et synchronisés.", {
        style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' }
      });
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto h-full flex flex-col min-h-screen">
      
      <header className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
          <Settings className="text-amber-500" size={32} />
          Paramètres <span className="text-amber-400">Locaux</span>
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
          Configuration du nœud communal
        </p>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8">
        
        {/* SIDEBAR TABS */}
        <div className="col-span-12 md:col-span-3 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                activeTab === tab.id 
                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                : 'bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENU DES TABS */}
        <div className="col-span-12 md:col-span-9 bg-[#050914] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSave} className="h-full flex flex-col">
            
            <div className="flex-1 space-y-8">
              <AnimatePresence mode="wait">
                
                {/* TAB : GÉNÉRAL */}
                {activeTab === 'general' && (
                  <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6">Informations de la Mairie</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom de l'Entité</label>
                        <input type="text" defaultValue="Mairie de Yopougon" className="w-full bg-[#020617] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Code Hyperviseur (Nœud)</label>
                        <input type="text" defaultValue="NODE-YOP-001" disabled className="w-full bg-white/5 border border-transparent rounded-xl p-4 text-sm text-slate-500 cursor-not-allowed font-mono" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Maire en exercice</label>
                        <input type="text" defaultValue="Adama BICTOGO" className="w-full bg-[#020617] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB : SÉCURITÉ */}
                {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-500"/> Protocoles d'Accès
                    </h2>
                    
                    <div className="bg-[#020617] border border-white/5 p-6 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Smartphone size={20}/></div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-1">Authentification à Double Facteur (2FA)</h4>
                          <p className="text-xs text-slate-500">Forcer le 2FA pour tous les agents de la mairie.</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>

                    <div className="bg-[#020617] border border-white/5 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-4">
                        <Key size={16} className="text-slate-400"/>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Délai d'expiration de session</h4>
                      </div>
                      <select className="w-full bg-[#050914] border border-white/10 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none">
                        <option value="15">15 minutes d'inactivité</option>
                        <option value="30">30 minutes d'inactivité</option>
                        <option value="60">1 heure d'inactivité</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* TAB : SYNC */}
                {activeTab === 'sync' && (
                  <motion.div key="sync" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex gap-4">
                      <AlertTriangle className="text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Connexion à l'Hyperviseur d'État</h4>
                        <p className="text-[11px] text-amber-200/70 leading-relaxed">Les modifications de ces paramètres peuvent couper la liaison avec la base de données nationale. Accès restreint.</p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">URL Endpoint API Nationale</label>
                      <input type="text" defaultValue="https://api.souverain.ci/v1/sync" disabled className="w-full bg-white/5 border border-transparent rounded-xl p-4 text-sm text-slate-500 font-mono" />
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                {isSaving ? "Enregistrement..." : "Sauvegarder les modifications"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}