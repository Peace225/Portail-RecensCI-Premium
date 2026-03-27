// src/backoffice/AnalyticsPanel.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, RefreshCw, 
  BarChart3, AlertCircle, Info 
} from "lucide-react";

export interface AnalyticsData {
  metric: string;
  value: number;
  description?: string;
  trend?: "up" | "down" | "stable";
}

const AnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation de calcul de statistiques réelles depuis Supabase
      // Dans un vrai cas, tu pourrais appeler une RPC ou faire plusieurs counts
      const { count: totalPop } = await supabase.from('citizens').select('*', { count: 'exact', head: true }).eq('role', 'CITIZEN');
      const { count: totalAgents } = await supabase.from('citizens').select('*', { count: 'exact', head: true }).eq('role', 'AGENT');

      const data: AnalyticsData[] = [
        { 
          metric: "Population Totale", 
          value: totalPop || 0, 
          description: "Indicateur de croissance démographique", 
          trend: "up" 
        },
        { 
          metric: "Unités de Terrain", 
          value: totalAgents || 0, 
          description: "Agents d'accréditation actifs", 
          trend: "stable" 
        },
        { 
          metric: "Taux de Couverture", 
          value: 74, // Exemple statique ou calculé
          description: "Zones géographiques scannées", 
          trend: "up" 
        }
      ];
      
      setAnalytics(data);
    } catch (err: any) {
      setError("Échec de la liaison avec le noyau de données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-900/50 border border-white/5 rounded-[2rem] animate-pulse">
        <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Compilation des flux...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <div className="space-y-1">
          <p className="text-white font-black uppercase tracking-widest">Alerte de Synchronisation</p>
          <p className="text-xs text-red-400 font-mono italic">{error}</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 px-6 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
        >
          Réinitialiser le flux
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER DU PANEL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">
            Monitoring <span className="text-purple-500">Analytique</span>
          </h2>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          <RefreshCw size={12} /> Actualiser
        </button>
      </div>

      {/* GRILLE DE DATA-CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analytics.map((item, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={item.metric}
            className="group relative bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-purple-500/30 transition-all duration-500"
          >
            {/* Effet de scanline au hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.metric}</p>
                <h3 className="text-4xl font-black text-white italic tracking-tighter">
                  {item.value.toLocaleString('fr-CI')}
                  {item.metric.includes("Taux") && "%"}
                </h3>
                {item.description && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Info size={10} />
                    <p className="text-[8px] font-bold uppercase tracking-tight">{item.description}</p>
                  </div>
                )}
              </div>

              {/* TENDANCE */}
              {item.trend && (
                <div className={`p-2 rounded-xl ${
                  item.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-800 text-slate-500"
                }`}>
                  {item.trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPanel;