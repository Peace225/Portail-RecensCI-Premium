// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, IdCard, User, Mail, Phone, Lock, 
  ShieldCheck, Cpu, Zap, ArrowRight, AlertTriangle, Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";

import DocumentUploadHUD from "../components/DocumentUploadHUD";
// ---> IMPORT DU CLIENT SUPABASE <---
import { supabase } from "../supabaseClient"; 

const styles = `
  @keyframes scan-v { 0% { top: -100%; } 100% { top: 100%; } }
  .animate-scan-v { animation: scan-v 4s linear infinite; }
  .glass-hud {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .cyber-input {
    background: rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: white !important;
    transition: all 0.3s ease;
  }
  .cyber-input:focus {
    border-color: #f97316 !important;
    box-shadow: 0 0 15px rgba(249, 115, 22, 0.1);
  }
`;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nni: "", nom: "", prenoms: "", email: "", telephone: "", password: "", confirmPassword: "", photoUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (formData.nni.length !== 10) return "Le NNI doit contenir exactement 10 chiffres.";
    if (formData.password.length < 8) return "Sécurité insuffisante : 8 caractères minimum.";
    if (formData.password !== formData.confirmPassword) return "Désynchronisation des mots de passe.";
    if (!formData.photoUrl) return "Le scan biométrique (Photo) est obligatoire.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Inscription Auth Supabase (Création du "compte de connexion")
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Échec de la création de l'identité numérique.");

      // 2. Insertion dans la table `citizens` (Le "Profil")
      const { error: dbError } = await supabase
        .from('citizens')
        .insert([
          {
            id: authData.user.id, // On lie la table au compte Auth créé
            nni: formData.nni,
            nom: formData.nom,
            prenoms: formData.prenoms,
            email: formData.email,
            telephone: formData.telephone,
            photo_url: formData.photoUrl
          }
        ]);

      if (dbError) {
        // Optionnel : si l'insertion de profil échoue, il faudrait idéalement supprimer le compte Auth pour garder une base propre
        throw dbError;
      }

      toast.success("Nœud Citoyen Initialisé ! Enregistrement confirmé dans la base de données souveraine.", { duration: 4000 });
      navigate("/login");
      
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      // Gérer les erreurs courantes de Supabase pour un affichage plus clair
      if (err.message.includes("User already registered")) {
        setError("Cette identité numérique (Email) est déjà enregistrée.");
      } else if (err.code === '23505' && err.message.includes("nni")) { // Code PostgreSQL pour violation d'unicité
         setError("Ce Numéro National d'Identification (NNI) est déjà utilisé.");
      }
      else {
        setError(err.message || "Une erreur critique est survenue lors de l'initialisation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "nni" || name === "telephone") sanitizedValue = value.replace(/\D/g, '');
    if (name === "nom") sanitizedValue = value.toUpperCase();
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 flex flex-col pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <style>{styles}</style>
      <div className="absolute inset-0 [background-image:radial-gradient(circle,rgba(249,115,22,0.05)_1px,transparent_1px)] [background-size:30px_30px] opacity-30 pointer-events-none" />

      {/* --- LOGO HOLOGRAPHIQUE --- */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mt-20 mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-3 mb-6">
          <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
             <Fingerprint className="text-orange-500 animate-pulse" size={28} />
             <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent animate-scan-v" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white italic">RECENS<span className="text-orange-500">CI</span></h2>
        </motion.div>
        <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">Créer un Nœud Citoyen</h3>
        <p className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Initialisation de l'Identité Numérique Souveraine</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-hud rounded-[3.5rem] overflow-hidden border-t-4 border-t-orange-500 shadow-2xl">
          <div className="py-12 px-6 sm:px-12">
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-red-400">
                  <AlertTriangle size={20} className="shrink-0" />
                  <p className="text-[11px] font-black uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <InputHUD label="Numéro National d'Identification (NNI)" name="nni" value={formData.nni} onChange={handleChange} placeholder="0123456789" maxLength={10} icon={<IdCard size={18} />} helper="Référence unique à 10 chiffres du registre ONECI." />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputHUD label="Nom de Famille" name="nom" value={formData.nom} onChange={handleChange} placeholder="KOUASSI" icon={<User size={18} />} />
                <InputHUD label="Prénoms" name="prenoms" value={formData.prenoms} onChange={handleChange} placeholder="Koffi Jean" icon={<Sparkles size={18} />} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputHUD label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="citoyen@cloud.ci" icon={<Mail size={18} />} />
                <InputHUD label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="0701020304" maxLength={10} icon={<Phone size={18} />} />
              </div>

              {/* INTÉGRATION DU WIDGET CLOUDINARY */}
              <div className="pt-4 pb-2">
                <DocumentUploadHUD 
                  label="Scan Biométrique (Photo d'Identité)"
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, photoUrl: url }))}
                />
              </div>

              <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputHUD label="Clé de Sécurité" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={<Lock size={18} />} />
                <InputHUD label="Confirmation" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" icon={<ShieldCheck size={18} />} />
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase tracking-[0.4em] text-[11px] shadow-lg hover:shadow-orange-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 border border-orange-500/50">
                {isLoading ? <Cpu size={20} className="animate-spin" /> : <><Zap size={18} /> <span>Initialiser mon Espace</span> <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-10 text-center border-t border-white/5 pt-8">
              <Link to="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors">Identité déjà enregistrée ? Accéder au Terminal de Connexion</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InputHUD = ({ label, name, type = "text", value, onChange, placeholder, maxLength, icon, helper }: any) => (
  <div className="space-y-2 group w-full">
    <div className="flex items-center justify-between px-2">
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">{label}</label>
      {icon && <span className="text-slate-700 group-focus-within:text-orange-500/50 transition-colors">{icon}</span>}
    </div>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} required className="w-full p-4 cyber-input rounded-2xl outline-none text-sm font-bold placeholder:text-slate-800" />
    {helper && <p className="px-2 text-[8px] font-bold text-slate-600 uppercase italic">{helper}</p>}
  </div>
);

export default Register;