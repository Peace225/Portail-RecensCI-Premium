// Module 14 — Support & Tickets
import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { toast } from "react-hot-toast";
import { MessageSquare, Plus, X, Cpu, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Acte civil", "Accès plateforme", "Erreur de données", "Technique", "Autre"];
const PRIORITIES = [
  { value: "FAIBLE", label: "Faible", color: "text-slate-400" },
  { value: "NORMALE", label: "Normale", color: "text-blue-400" },
  { value: "HAUTE", label: "Haute", color: "text-amber-400" },
  { value: "URGENTE", label: "Urgente", color: "text-red-400" },
];

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  OUVERT:    { color: "text-amber-400", icon: Clock },
  EN_COURS:  { color: "text-blue-400",  icon: Cpu },
  RESOLU:    { color: "text-emerald-400", icon: CheckCircle },
  FERME:     { color: "text-slate-500", icon: X },
};

const Support: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: "", category: "Acte civil", description: "", priority: "NORMALE" });

  const fetchTickets = () => {
    const endpoint = user.role === 'CITIZEN' ? '/modules/support?limit=20' : '/modules/support?limit=50';
    apiService.get<any>(endpoint)
      .then(res => setTickets(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.post('/modules/support', form);
      toast.success("Ticket créé ! Notre équipe vous répondra sous 24h.");
      setShowForm(false);
      fetchTickets();
    } catch {
      toast.error("Erreur lors de la création du ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex justify-between items-end">
          <div className="border-l-4 border-blue-500 pl-6">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Support & <span className="text-blue-400">Tickets</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Assistance et signalement de problèmes</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
            <Plus size={16} /> Nouveau ticket
          </button>
        </div>

        {/* Liste tickets */}
        <div className="space-y-4">
          {loading && <div className="flex justify-center py-10"><span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" /></div>}
          {tickets.map(ticket => {
            const statusConf = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OUVERT;
            const StatusIcon = statusConf.icon;
            const priority = PRIORITIES.find(p => p.value === ticket.priority);
            return (
              <div key={ticket.id} className="bg-[#050914] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[9px] font-black uppercase flex items-center gap-1 ${statusConf.color}`}>
                        <StatusIcon size={10} /> {ticket.status}
                      </span>
                      <span className={`text-[9px] font-bold uppercase ${priority?.color || 'text-slate-400'}`}>{priority?.label}</span>
                      <span className="text-[9px] text-slate-600 uppercase">{ticket.category}</span>
                    </div>
                    <h4 className="text-sm font-black text-white">{ticket.subject}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ticket.description}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 shrink-0 ml-4">
                    {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            );
          })}
          {!loading && tickets.length === 0 && (
            <div className="text-center py-16 text-slate-600">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-xs font-black uppercase tracking-widest">Aucun ticket ouvert</p>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#050914] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Nouveau ticket</h3>
                  <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sujet</label>
                    <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
                      className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Catégorie</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Priorité</label>
                      <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                        className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none">
                        {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} required
                      className="w-full p-3 bg-slate-800 rounded-xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-2xl uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <><Cpu size={16} className="animate-spin" /> Envoi...</> : "Soumettre le ticket"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Support;
