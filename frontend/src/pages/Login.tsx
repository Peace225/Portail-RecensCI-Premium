// src/pages/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { Users, ShieldCheck, Mail, Lock, LogIn, AlertCircle, Fingerprint } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";

const Login: React.FC = () => {
  const [mode, setMode] = useState<"AGENT" | "CITOYEN">("AGENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Pour la démo, on utilise tjs l'email. En prod Citoyen, on mapperait le NNI à un compte.
      await signInWithEmailAndPassword(auth, email, password);
      
      // Redirection dynamique selon le mode choisi
      if (mode === "AGENT") {
        navigate("/dashboard");
      } else {
        navigate("/me"); // Espace Citoyen
      }
      
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError("Identifiant inconnu dans notre registre national.");
          break;
        case 'auth/wrong-password':
          setError("Le mot de passe saisi est incorrect.");
          break;
        default:
          setError("Erreur d'authentification. Veuillez vérifier vos accès.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <span className="text-white font-black text-2xl">R</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900">
            RECENS<span className="text-orange-600 underline decoration-4 underline-offset-8">CI</span>
          </h2>
        </div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Portail d'identification sécurisé</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white">
          <CardContent className="p-8 sm:p-12">
            
            {/* SÉLECTEUR DE MODE IX */}
            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
              <button 
                onClick={() => setMode("AGENT")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === "AGENT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <ShieldCheck size={16} /> Agent État
              </button>
              <button 
                onClick={() => setMode("CITOYEN")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === "CITOYEN" ? "bg-white text-orange-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
              >
                <Users size={16} /> Citoyen
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in shake duration-500">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label={mode === "AGENT" ? "Email Professionnel" : "Numéro National (NNI)"}
                type={mode === "AGENT" ? "email" : "text"}
                placeholder={mode === "AGENT" ? "prenom.nom@recensci.ci" : "Ex: CI-002938475"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={mode === "AGENT" ? <Mail className="w-5 h-5 text-slate-400" /> : <Fingerprint className="w-5 h-5 text-slate-400" />}
                className="rounded-2xl border-slate-200 focus:border-orange-500"
              />

              <div className="space-y-2">
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  leftIcon={<Lock className="w-5 h-5 text-slate-400" />}
                  className="rounded-2xl border-slate-200 focus:border-orange-500"
                />
                <div className="text-right">
                  <Link to="/forgot" className="text-[10px] font-black uppercase text-orange-600 hover:text-orange-700 tracking-widest">
                    Accès perdu ?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full py-6 rounded-2xl shadow-xl transition-all font-black uppercase tracking-[0.2em] text-xs ${mode === "AGENT" ? "bg-slate-900 hover:bg-black text-white" : "bg-orange-600 hover:bg-orange-700 text-white"}`}
                isLoading={isLoading}
              >
                {!isLoading && <LogIn size={18} className="mr-2" />}
                {mode === "AGENT" ? "Accéder au Dashboard" : "Ouvrir mon Espace"}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {mode === "AGENT" ? "Système de Recensement National" : "Portail Services aux Citoyens"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;