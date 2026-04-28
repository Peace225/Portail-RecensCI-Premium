// Module 13 — Alertes sanitaires
import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { toast } from "react-hot-toast";
import { Activity, AlertTriangle, CheckCircle, Plus, X, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  FAIBLE:    { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Faible" },
  MODERE:    { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     label: "Modéré" },
  ELEVE:     { color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20",   label: "Élevé" },
  CRITIQUE:  { color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20",         label: "Critique" },
};

const HealthAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", type: "", severity: "MODERE", region: "", city: "", description: "", affectedCount: "" });

  const fetchAlerts = () => {
    apiService.get<any>('/modules/health-alerts?limit=20')
      .then(res => setAlerts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.post('/modules/health-alerts', { ...form, affectedCount: form.affectedCount ? Number(form.affectedCount) : undefined });
      toast.success("Alerte sanitaire déclarée !");
      setShowForm(false);
      fetchAlerts();
    } catch {
      toast.error("Erreur lors de la déclaration.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (id: string) => {
    await apiService.patch(`/modules/health-alerts/${id}/resolve`, {});
    toast.success("Alerte résolue");
    fetchAlerts();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Activity className="text-red-500" size={32} /> Alertes <span className="text-red-400">Sanitaires</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Surveillance épidémiologique nationale</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg">
          <Plus size={16} /> Déclarer une alerte
        </button>
      </div>

      {/* Liste des alertes */}
      <div className="space-y-4">
        {loading && <div className="flex justify-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400" /></div>}
        {alerts.map(alert => {
          const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.MODERE;
          return (
            <div key={alert.id} className={`p-6 rounded-2xl border ${sev.bg} flex items-start justify-between gap-4`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${sev.bg} ${sev.color}`}>{sev.label}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{alert.type}</span>
                  {alert.status === 'RESOLUE' && <span className="text-[9px] font-black text-emerald-400 uppercase flex items-center gap-1"><CheckCircle size={10} /> Résolue</span>}
                </div>
                <h4 className="text-sm font-black text-white uppercase">{alert.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{alert.region}{alert.city ? ` — ${alert.city}` : ''}</p>
                <p className="text-xs text-slate-300 mt-2">{alert.description}</p>
                {alert.affectedCount && <p className="text-[10px] text-amber-400 mt-1 font-bold">{alert.affectedCount} personnes affectées</p>}
              </div>
              {alert.status !== 'RESOLUE' && (
                <button onClick={() => handleResolve(alert.id)}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-500/20 transition-all shrink-0">
                  Résoudre
                </button>
              )}
            </div>
          );
        })}
        {!loading && alerts.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <Activity size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xs font-black uppercase tracking-widest">Aucune alerte active</p>
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#050914] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Déclarer une alerte</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Titre", name: "title", placeholder: "Ex: Épidémie de choléra à Yopougon" },
                  { label: "Type", name: "type", placeholder: "Épidémie, Contamination eau, Malnutrition..." },
                  { label: "Région", name: "region", placeholder: "Ex: Abidjan - Yopougon" },
                  { label: "Ville / Quartier", name: "city", placeholder: "Optionnel" },
                  { label: "Personnes affectées", name: "affectedCount", placeholder: "Nombre estimé", type: "number" },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.label}</label>
                    <input name={f.name} type={f.type || "text"} placeholder={f.placeholder}
                      onChange={e => setForm({...form, [f.name]: e.target.value})}
                      className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-600" />
                  </div>
                ))}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sévérité</label>
                  <select name="severity" onChange={e => setForm({...form, severity: e.target.value})}
                    className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none">
                    {Object.entries(SEVERITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                  <textarea name="description" rows={3} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-red-500 resize-none" required />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <><Cpu size={16} className="animate-spin" /> Envoi...</> : "Déclarer l'alerte"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthAlerts;
