// src/backoffice/Reports.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, FolderOpen, Download, Plus, 
  Calendar, Database, ShieldCheck, RefreshCw,
  FileSearch, AlertCircle, FileBarChart
} from "lucide-react";
import { toast } from "react-hot-toast";

export interface Report {
  id: string;
  title: string;
  type: "MENSUEL" | "ANNUEL" | "AUDIT" | "STATISTIQUE";
  created_at: string;
  status: "READY" | "GENERATING" | "FAILED";
  file_url?: string;
  file_size?: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // On récupère les rapports depuis ta table 'reports'
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      toast.error("Erreur de liaison avec les archives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = () => {
    toast.loading("Génération du rapport cryptographique en cours...", {
      style: { background: '#0f172a', color: '#f97316', border: '1px solid #f97316' },
      duration: 3000
    });
  };

  if (loading) return (
    <div className="w-full h-64 flex flex-col items-center justify-center bg-slate-900/40 border border-white/5 rounded-[2.5rem] animate-pulse">
      <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Accès aux serveurs d'archives...</p>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
            <FolderOpen className="text-orange-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Archives & Rapports</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1">Souveraineté Documentaire Nationale</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-orange-600/20"
        >
          <Plus size={16} /> Nouveau Rapport
        </button>
      </div>

      {/* --- LISTE DES RAPPORTS --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Registres Documentaires</h3>
          <button onClick={fetchReports} className="text-slate-600 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {reports.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <FileSearch className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Aucune archive disponible</p>
            </div>
          ) : (
            reports.map((report, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                key={report.id} 
                className="p-6 hover:bg-white/[0.03] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
              >
                <div className="flex items-start gap-5">
                  <div className={`p-4 rounded-2xl border transition-transform group-hover:scale-110 ${
                    report.type === "AUDIT" ? "bg-purple-500/10 border-purple-500/20 text-purple-500" :
                    report.type === "STATISTIQUE" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                    "bg-orange-500/10 border-orange-500/20 text-orange-500"
                  }`}>
                    <FileBarChart size={24} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{report.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-600" />
                        {new Intl.DateTimeFormat('fr-CI', { dateStyle: 'long' }).format(new Date(report.created_at))}
                      </span>
                      {report.file_size && (
                        <span className="flex items-center gap-1.5">
                          <Database size={12} className="text-slate-600" />
                          {report.file_size}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 min-w-[150px] justify-end">
                  {report.status === "READY" ? (
                    <button 
                      onClick={() => window.open(report.file_url, '_blank')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      <Download size={14} /> Télécharger
                    </button>
                  ) : report.status === "GENERATING" ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/20 rounded-xl text-[9px] font-black text-orange-500 uppercase animate-pulse">
                      <RefreshCw size={12} className="animate-spin" /> En cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-xl text-[9px] font-black text-red-500 uppercase">
                      <AlertCircle size={12} /> Échec
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {/* FOOTER ARCHIVE */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center items-center gap-2">
           <ShieldCheck size={12} className="text-emerald-500" />
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">
             Archives Certifiées par Protocole d'État
           </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;