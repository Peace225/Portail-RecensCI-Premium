// src/pages/citizen/CitizenRequests.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, CheckCircle2, AlertCircle, FileText, 
  ChevronRight, Download, Eye, QrCode, X, Printer,
  ShieldCheck, Database, Cpu, Zap,
  AlertTriangle, Send, MessageSquare, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { apiService } from "../../services/apiService";

// --- MOCK DATA FALLBACK ---
const MOCK_REQUESTS = [
  { 
    id: "REQ-892", 
    type: "Extrait d'Acte de Naissance", 
    date: "10 Mars 2026", 
    status: "EN_COURS", 
    color: "orange",
    steps: [
      { label: "Dépôt du dossier", done: true, time: "10/03 - 09:15" },
      { label: "Vérification des archives", done: true, time: "10/03 - 14:30" },
      { label: "Signature de l'Officier", done: false, time: "En attente" },
      { label: "Mise à disposition", done: false, time: "-" }
    ]
  },
  { id: "REQ-451", type: "Certificat de Résidence", date: "02 Fév 2026", status: "VALIDÉ", color: "emerald" },
  { id: "REQ-120", type: "Certificat de Nationalité", date: "20 Jan 2026", status: "REJETÉ", color: "red" },
];

const styles = `
  @keyframes scan-h { 0% { left: -100%; } 100% { left: 100%; } }
  .animate-scan-h { animation: scan-h 3s linear infinite; }
  .glass-hud { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
  .error-glitch { animation: glitch 0.2s infinite; }
  @keyframes glitch { 0% { opacity: 1; } 50% { opacity: 0.8; transform: translateX(1px); } 100% { opacity: 1; } }
`;

const statusColorMap: Record<string, string> = {
  EN_COURS: "orange",
  VALIDÉ: "emerald",
  REJETÉ: "red",
};

const mapApiRequest = (r: any) => ({
  id: r.id || r.requestId || "REQ-???",
  type: r.type || r.documentType || "Document",
  date: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""),
  status: r.status || "EN_COURS",
  color: statusColorMap[r.status] || "orange",
  steps: r.steps || undefined,
});

const CitizenRequests: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const [requests, setRequests] = useState<any[]>(MOCK_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isCorrectionMode, setIsCorrectionMode] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    apiService.get<any[]>(`/citizens/${userId}/requests`)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRequests(data.map(mapApiRequest));
        }
      })
      .catch(() => {
        // silently fall back to mock data
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  const handleReportError = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsCorrectionMode(false);
      setSelectedDoc(null);
      toast.success("Signalement transmis au Service de Contrôle", {
        style: { borderRadius: '15px', background: '#0f172a', color: '#fff', border: '1px solid #f97316' }
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24 relative overflow-hidden font-sans">
      <style>{styles}</style>
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,130,0,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="border-l-4 border-orange-500 pl-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Mes <span className="text-orange-500">Demandes</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Suivi des procédures administratives</p>
          </div>
        </div>

        {/* --- LISTE DES REQUÊTES --- */}
        <div className="grid grid-cols-1 gap-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-orange-500" />
            </div>
          ) : requests.map((req, idx) => (
            <motion.div 
              key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedDoc(req)}
              className="group glass-hud p-6 md:p-8 rounded-[2.5rem] hover:bg-white/5 transition-all cursor-pointer border border-white/5 hover:border-orange-500/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-${req.color}-500 shadow-inner`}>
                    {req.status === "EN_COURS" ? <Clock size={24} className="animate-pulse" /> : <FileText size={24} />}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white tracking-tight uppercase italic">{req.type}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                        req.status === 'VALIDÉ' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 
                        req.status === 'REJETÉ' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 
                        'border-orange-500/30 text-orange-500 bg-orange-500/5 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                      <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">{req.id} • {req.date}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white transition-colors">Consulter</span>
                  <ChevronRight size={20} className="text-slate-700 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MODAL HOLOGRAPHIQUE --- */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setSelectedDoc(null); setIsCorrectionMode(false); }} className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-2xl glass-hud rounded-[3.5rem] overflow-hidden border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            >
              {/* HEADER MODAL */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                  <div className="flex items-center gap-3">
                    <Database size={16} className="text-orange-500" />
                    <h3 className="font-black text-white uppercase text-[9px] tracking-[0.3em]">Session_Vérification_{selectedDoc.id}</h3>
                  </div>
                  <button onClick={() => { setSelectedDoc(null); setIsCorrectionMode(false); }} className="p-2 hover:bg-red-500 text-slate-500 hover:text-white rounded-xl transition-all"><X size={20} /></button>
              </div>

              <div className="relative min-h-[400px]">
                {/* --- CAS 1 : DOCUMENT EN COURS (TIMELINE) --- */}
                {selectedDoc.status === "EN_COURS" ? (
                  <div className="p-12 space-y-10">
                    <div className="text-center space-y-4">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 border-4 border-orange-500/10 rounded-full border-t-orange-500 animate-spin" />
                        <Cpu className="absolute inset-0 m-auto text-orange-500 animate-pulse" size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Traitement Tactique</h3>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Votre dossier est en cours de validation par l'Officier d'État Civil</p>
                    </div>

                    <div className="space-y-6 max-w-sm mx-auto">
                      {selectedDoc.steps?.map((step: any, i: number) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className={`mt-1 w-3 h-3 rounded-full ${step.done ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-slate-800'}`} />
                          <div className="flex-1 border-l border-white/10 pl-6 pb-2">
                            <p className={`text-[10px] font-black uppercase tracking-wider ${step.done ? 'text-white' : 'text-slate-600'}`}>{step.label}</p>
                            <p className="text-[8px] font-mono text-slate-500 mt-1">{step.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* --- CAS 2 : DOCUMENT VALIDÉ (L'ACTE) --- */
                  <div className="p-10 md:p-16 space-y-10 text-center relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none"><ShieldCheck size={400} /></div>
                    
                    <div className="space-y-2 relative z-10">
                        <h1 className="text-sm font-black uppercase tracking-[0.4em] text-white">République de Côte d'Ivoire</h1>
                        <p className="text-[8px] uppercase font-bold tracking-widest text-slate-500">Union - Discipline - Travail</p>
                    </div>

                    <div className="py-10 border-y border-white/10 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-scan-h" />
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{selectedDoc.type}</h2>
                        <div className="flex items-center justify-center gap-4">
                          <span className="font-mono text-[9px] text-orange-500 bg-orange-500/5 px-2 py-1 rounded border border-orange-500/20">AUTHENTICITÉ : CERTIFIÉE</span>
                        </div>
                    </div>

                    <div className="text-left space-y-6">
                        <div className="grid grid-cols-2 gap-8 text-[11px] font-bold uppercase tracking-wider">
                           <div className="space-y-1">
                              <p className="text-slate-500 text-[8px]">Titulaire</p>
                              <p className="text-white">KOUHAME KEVIN GAEL</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-slate-500 text-[8px]">ID Souverain</p>
                              <p className="text-white">CI-091-2026-X</p>
                           </div>
                        </div>
                        <p className="font-serif italic text-slate-400 text-sm leading-relaxed">
                          "Ce document numérique constitue un titre authentique et opposable de plein droit auprès de toutes les administrations nationales."
                        </p>
                    </div>

                    <div className="flex justify-between items-end pt-6">
                        <div className="w-20 h-20 bg-white p-1.5 rounded-xl border-4 border-white/10 shadow-2xl">
                          <QrCode size="100%" className="text-slate-950" />
                        </div>
                        <div className="text-right space-y-1">
                           <p className="text-[7px] font-black uppercase text-slate-500">Signé numériquement par</p>
                           <p className="text-xs font-black text-white italic">PRÉFECTURE D'ABIDJAN</p>
                           <p className="text-[8px] font-mono text-orange-500/50 italic">Hash: 8f92...a3e1</p>
                        </div>
                    </div>
                  </div>
                )}

                {/* --- OVERLAY CORRECTION IA --- */}
                <AnimatePresence>
                  {isCorrectionMode && (
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute inset-0 z-50 bg-slate-950/98 backdrop-blur-3xl p-10 flex flex-col">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 error-glitch border border-orange-500/20"><AlertTriangle size={24} /></div>
                        <div>
                          <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Protocole de Rectification</h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Signalement d'anomalie sur archive digitale</p>
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Section Concernée</label>
                          <select className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 outline-none text-white font-bold text-xs appearance-none cursor-pointer hover:border-orange-500/30 transition-all">
                            <option className="bg-slate-900 italic">Identité du titulaire</option>
                            <option className="bg-slate-900 italic">Date / Lieu de l'acte</option>
                            <option className="bg-slate-900 italic">Filiation parentale</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Précisions sur l'erreur</label>
                          <textarea rows={4} placeholder="Veuillez détailler l'erreur constatée..." className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none text-white font-bold text-xs focus:border-orange-500 transition-all placeholder:text-slate-700" />
                        </div>

                        <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                          <MessageSquare className="text-blue-500 shrink-0" size={16} />
                          <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">L'agent IA va corréler votre signalement avec les données du RNPP avant de soumettre le dossier à un officier.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        <button onClick={() => setIsCorrectionMode(false)} className="flex-1 py-4 bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-all">Annuler</button>
                        <button onClick={handleReportError} disabled={isSending} className="flex-2 px-10 py-4 bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
                          {isSending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Initier la Rectification</>}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FOOTER ACTIONS (Visible seulement pour les documents validés) */}
              {selectedDoc.status === "VALIDÉ" && !isCorrectionMode && (
                <div className="p-8 bg-black/40 flex flex-col sm:flex-row gap-4 border-t border-white/5">
                    <div className="flex flex-1 gap-3">
                      <button className="flex-1 py-4 bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-500 transition-all shadow-lg active:scale-95"><Download size={16} /> PDF Sécurisé</button>
                      <button className="flex-1 py-4 bg-white/5 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10 active:scale-95"><Printer size={16} /> Imprimer</button>
                    </div>
                    
                    <button 
                      onClick={() => setIsCorrectionMode(true)}
                      className="py-4 px-6 bg-red-500/10 text-red-500 font-black text-[9px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    >
                      <AlertTriangle size={16} /> Signaler une erreur
                    </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenRequests;