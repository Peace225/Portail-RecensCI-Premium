// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Baby, FileText, Heart, ShieldCheck, 
  ArrowRight, Globe, Fingerprint, Lock, 
  Zap, Map, Users, BarChart3, ShieldAlert
} from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* --- 1. SECTION HÉRO (IMPACT VISUEL) --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        {/* Gradients diffus d'ambiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Portail Officiel • République de Côte d'Ivoire</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000">
              L'Identité <span className="text-orange-500 italic">Digitale</span> <br /> 
              Souveraine.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              RecensCI centralise votre état civil et votre protection sociale sur une infrastructure biométrique sécurisée de nouvelle génération.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link to="/login" className="group px-12 py-6 bg-orange-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-orange-600/30 hover:bg-orange-500 transition-all active:scale-95">
                Accéder à mon espace
                <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" size={18} />
              </Link>
              <button className="px-12 py-6 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                Vérifier un document
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. GRILLE DES SERVICES (DONT RECENSEMENT) --- */}
      <section className="relative z-20 -mt-20 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard 
            icon={<Map size={32} />} 
            title="Recensement" 
            desc="Déclarez votre ménage pour orienter les infrastructures publiques."
            color="orange"
            isNew
          />
          <ServiceCard 
            icon={<Baby size={32} />} 
            title="Naissances" 
            desc="Enregistrement biométrique immédiat des nouveaux-nés."
            color="blue"
          />
          <ServiceCard 
            icon={<FileText size={32} />} 
            title="Certificats" 
            desc="Copies intégrales sécurisées par QR Code d'État."
            color="slate"
          />
          <ServiceCard 
            icon={<Heart size={32} />} 
            title="Unions" 
            desc="Mariages et reconnaissance de filiation simplifiés."
            color="emerald"
          />
        </div>
      </section>

      {/* --- 3. SECTION IMPACT : RECENSEMENT NATIONAL --- */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-2xl border border-slate-100 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-2xl text-orange-600 text-[10px] font-black uppercase tracking-widest">
                <BarChart3 size={16} /> Impact National
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic">
                Recensement <br />
                <span className="text-orange-500">National 2026</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
                Votre participation permet à l'État de planifier avec précision la construction d'écoles, d'hôpitaux et de réseaux routiers dans votre localité. 
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <StatBox value="98.2%" label="Couverture Territoriale" />
                <StatBox value="+12M" label="Citoyens Certifiés" />
              </div>
            </div>

            <div className="w-full lg:w-1/3 space-y-4">
              <Link to="/login" className="w-full py-10 bg-slate-900 text-white rounded-[3rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-orange-600 transition-all flex flex-col items-center gap-4 group">
                <Users size={32} className="group-hover:scale-110 transition-transform" />
                Déclarer mon ménage
              </Link>
              <button className="w-full py-6 bg-white border-2 border-slate-100 text-slate-400 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 hover:border-slate-300 transition-all">
                Voir les statistiques
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. SECTION ARGUMENTS : SÉCURITÉ --- */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Le Registre National <br /> 
                <span className="text-slate-400 italic font-serif">Une forteresse de données.</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <FeatureItem icon={<Fingerprint />} title="Biométrie" text="Accès sécurisé via reconnaissance faciale et digitale." />
                <FeatureItem icon={<Lock />} title="Souveraineté" text="Données hébergées sur le territoire national." />
                <FeatureItem icon={<Zap />} title="Automation" text="Calcul immédiat des droits sociaux et bourses." />
                <FeatureItem icon={<Globe />} title="Diaspora" text="Service accessible pour les ivoiriens du monde." />
              </div>
            </div>

            {/* ILLUSTRATION ABSTRAITE PREMIUM */}
            <div className="relative group">
                <div className="absolute inset-0 bg-orange-500/10 rounded-[4rem] blur-[80px] group-hover:bg-blue-500/10 transition-all duration-1000" />
                <div className="relative bg-slate-900 rounded-[4rem] p-16 shadow-2xl border border-white/5 space-y-10">
                    <div className="flex justify-between items-center">
                        <ShieldCheck className="text-emerald-500" size={40} />
                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-3 w-full bg-white/5 rounded-lg" />
                        <div className="h-3 w-4/5 bg-white/5 rounded-lg" />
                        <div className="h-3 w-1/2 bg-white/5 rounded-lg" />
                    </div>
                    <div className="pt-8">
                        <div className="h-48 w-full bg-gradient-to-br from-orange-500 to-orange-700 rounded-[2.5rem] flex items-center justify-center">
                            <Fingerprint size={64} className="text-white opacity-40 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. CALL TO ACTION FINAL --- */}
      <section className="container mx-auto px-6 mb-24">
        <div className="bg-slate-950 p-16 md:p-32 rounded-[5rem] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-orange-600/5 blur-3xl animate-pulse" />
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter italic relative z-10 leading-[0.9]">
                Prêt à sécuriser <br /> votre avenir ?
            </h2>
            <div className="pt-10 relative z-10">
                <Link to="/login" className="px-16 py-8 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all shadow-2xl inline-block">
                    Créer mon profil citoyen
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

// --- SOUS-COMPOSANTS UI ---

const ServiceCard = ({ icon, title, desc, color, isNew }: any) => (
  <div className="group bg-white p-10 rounded-[3.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.06)] border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
    {isNew && (
      <div className="absolute top-8 right-8 px-4 py-1.5 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-bounce">
        Actif
      </div>
    )}
    <div className={`w-16 h-16 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 uppercase italic">{title}</h3>
    <p className="text-xs text-slate-400 font-bold leading-relaxed uppercase tracking-widest">{desc}</p>
    <div className="mt-10 pt-8 border-t border-slate-50">
        <button className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-orange-600 flex items-center gap-3">
            Découvrir <ArrowRight size={14} />
        </button>
    </div>
  </div>
);

const StatBox = ({ value, label }: any) => (
  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
    <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic">{value}</h4>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
  </div>
);

const FeatureItem = ({ icon, title, text }: any) => (
  <div className="flex gap-5 group">
    <div className="mt-1 text-orange-500 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h4>
      <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{text}</p>
    </div>
  </div>
);

export default Home;