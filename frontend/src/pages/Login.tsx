// src/pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, Mail, Lock, Cpu, Zap, 
  ArrowRight, AlertTriangle, ShieldCheck 
} from "lucide-react";
import { toast } from "react-hot-toast";

import { apiService, tokenStorage } from "../services/apiService";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { UserRole } from "../types";

const styles = `
  @keyframes scan-v { 0% { top: -100%; } 100% { top: 100%; } }
  .animate-scan-v { animation: scan-v 4s linear infinite; }
  .glass-hud {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Appel au backend NestJS
      const data: any = await apiService.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Stockage du JWT
      tokenStorage.set(data.access_token);

      // Mise à jour Redux
      dispatch(
        login({
          id: data.user.id,
          name: data.user.name || formData.email.split("@")[0],
          email: formData.email,
          role: data.user.role as UserRole,
          structureId: data.user.institutionId || undefined,
        })
      );

      toast.success("Authentification Réussie", {
        style: {
          background: "#0f172a",
          color: "#f97316",
          border: "1px solid #f97316",
          borderRadius: "15px",
        },
      });

      // Redirection selon le rôle
      const role = data.user.role;
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        navigate("/backoffice", { replace: true });
      } else if (role === "ENTITY_ADMIN") {
        navigate("/portail/mairie", { replace: true });
      } else if (role === "AGENT") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/me", { replace: true });
      }
    } catch (err: any) {
      setError(err.message || "Échec de la connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col pt-28 pb-20 px-4 relative overflow-hidden font-sans">
      <style>{styles}</style>
      
      {/* Background Decor */}
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(249,115,22,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mt-20 mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-3 mb-6">
          <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
             <Fingerprint className="text-orange-500 animate-pulse" size={28} />
             <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-scan-v" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white italic">RECENS<span className="text-orange-500">CI</span></h2>
        </motion.div>
        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">Terminal d'Accès</h3>
        <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Identification de Niveau 1 Requise</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-hud rounded-[3rem] overflow-hidden border-t-4 border-t-orange-500 shadow-2xl">
          <div className="py-12 px-10">
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-red-400"
                >
                  <AlertTriangle size={20} className="shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors ml-2">Email Citoyen / Matricule</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 p-4 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-white font-bold transition-all" placeholder="nom@exemple.ci" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors ml-2">Clé de Sécurité</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full pl-12 p-4 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-white font-bold transition-all" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase tracking-[0.4em] text-[11px] shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 border border-orange-500/50">
                {isLoading ? <Cpu size={20} className="animate-spin" /> : <><Zap size={18} /> <span>Ouvrir la Session</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-10 text-center border-t border-white/5 pt-8 space-y-4">
              <Link to="/register" className="block text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors">Nouvelle Identité ? Créer un Nœud Citoyen</Link>
              <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <ShieldCheck size={12} /> Connexion Sécurisée AES-256
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;