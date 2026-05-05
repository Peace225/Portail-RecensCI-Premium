import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice"; 
import { 
  Fingerprint, Mail, Lock, Cpu, Zap, 
  ArrowRight, ShieldCheck, Eye, EyeOff, ShieldAlert
} from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "../supabaseClient";

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
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // ✅ Fixé : Utilisation du bon setter

    try {
      // 1. Authentification
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Récupération du profil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            role, 
            full_name, 
            institution_id, 
            department_id, 
            status, 
            communes(nom)
          `) 
          .eq('id', authData.user.id)
          .maybeSingle(); 

        if (profileError) throw profileError;

        if (profile) {
          // Sécurité Statut
          if (profile.status === 'BLOCKED') {
            await supabase.auth.signOut();
            throw new Error("Accès révoqué par l'autorité communale.");
          }

          // Extraction Commune
          let nomCommune = "Inconnue";
          if (profile.communes) {
            nomCommune = Array.isArray(profile.communes) 
              ? profile.communes[0]?.nom 
              : (profile.communes as any).nom || "Inconnue";
          }

          // 🛡️ LOGIQUE DE STRUCTURE BLINDÉE
          const finalStructureId = profile.institution_id || profile.department_id;

          if (!finalStructureId && profile.role !== 'SUPER_ADMIN') {
             // On ne bloque pas encore, mais on avertit bruyamment en console
             console.error("🔥 RESENSCI CRITICAL : Aucun institution_id trouvé pour cet utilisateur dans la DB !");
          }

          const payload = {
            id: authData.user.id,
            email: authData.user.email || "",
            name: profile.full_name,
            role: profile.role, 
            structureId: finalStructureId, 
            commune: nomCommune 
          };

          dispatch(login(payload));

          toast.success(`Session Ouverte : ${profile.full_name}`, {
            icon: '🛡️',
            style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981', borderRadius: '15px' }
          });
          
          // Routage
          const adminRoles = ['ENTITY_ADMIN', 'DIRECTEUR', 'CHEF_SERVICE'];
          if (adminRoles.includes(profile.role)) {
            navigate("/portail/mairie", { replace: true });
          } else {
            navigate("/portail/agent", { replace: true });
          }
          return; 
        }

        // 3. Fallback Citoyen
        const { data: citizenProfile } = await supabase
          .from('citizens')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (citizenProfile) {
          dispatch(login({
            id: authData.user.id,
            email: authData.user.email || "",
            name: `${citizenProfile.prenoms || ''} ${citizenProfile.nom || ''}`.trim(),
            role: "CITIZEN",
            nni: citizenProfile.nni
          }));

          toast.success("Authentification Citoyenne", { icon: '👤' });
          navigate("/me", { replace: true });
          return;
        }

        throw new Error("Profil non provisionné. Contactez votre administrateur.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Échec de l'identification.");
      toast.error("Accès Refusé");
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
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(249,115,22,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mt-10 md:mt-20 mb-8 md:mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-3 mb-6">
          <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
             <Fingerprint className="text-orange-500 animate-pulse" size={28} />
             <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-scan-v" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white italic">RECENS<span className="text-orange-500">CI</span></h2>
        </motion.div>
        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] italic text-center">Portail Souverain</h3>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-hud rounded-[3rem] overflow-hidden border-t-4 border-t-orange-500 shadow-2xl">
          <div className="py-10 md:py-12 px-6 md:px-10">
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-red-400 overflow-hidden"
                >
                  <ShieldAlert size={20} className="shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors ml-2">Email / Matricule</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 p-4 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-white font-bold text-sm transition-all" placeholder="matricule@mairie.ci" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors ml-2">Clé de Sécurité</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-slate-700 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required className="w-full pl-12 pr-12 p-4 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-orange-500 text-white font-bold text-sm transition-all" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-600 hover:text-orange-500 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-5 md:py-6 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase tracking-[0.3em] md:tracking-[0.4em] text-[10px] md:text-[11px] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 border border-orange-500/50 disabled:opacity-50">
                {isLoading ? <Cpu size={20} className="animate-spin" /> : <><Zap size={18} /> <span>Initier la Session</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-10 text-center border-t border-white/5 pt-8">
               <Link to="/register" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors mb-4 italic">Nouvel Enregistrement</Link>
               <p className="text-[7px] text-slate-700 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <ShieldCheck size={12} /> Standard de Sécurité AES-256
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;