import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, FileText, HardHat, Landmark, HeartHandshake, 
  ShieldAlert, ChevronRight, UserCheck, ArrowLeft, CheckCircle2, 
  XCircle, Clock, Smartphone, QrCode, TrendingUp, MapPin, 
  User, Zap, Scale, GraduationCap, Gavel, Construction
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- 1. CONFIGURATION DES DIRECTIONS ET SERVICES ---
const DIRECTIONS = [
  {
    id: "dsa",
    name: "Direction des Services Administratifs (DSA)",
    director: "M. Bakary TOURE",
    icon: <FileText className="text-orange-500" size={24} />,
    color: "orange",
    pendingDocs: 142,
    services: [
      { name: "Déclaration de Naissance", desc: "Enregistrement des nouveaux-nés." },
      { name: "Célébration de Mariage", desc: "Dépôt de dossier et réservation de date." },
      { name: "Demande d'Extrait d'Acte", desc: "Naissance, Mariage ou Décès." },
      { name: "Légalisation de Signature", desc: "Certification de documents officiels." }
    ]
  },
  {
    id: "dst",
    name: "Direction des Services Techniques (DST)",
    director: "Mme. Fatoumata KONE",
    icon: <HardHat className="text-emerald-500" size={24} />,
    color: "emerald",
    pendingDocs: 56,
    services: [
      { name: "Permis de Construire", desc: "Approbation de plans architecturaux." },
      { name: "Certificat d'Urbanisme", desc: "Vérification de constructibilité." },
      { name: "Occupation Domaine Public", desc: "Installation de commerces ou chantiers." }
    ]
  },
  {
    id: "dsf",
    name: "Direction des Services Financiers (DSF)",
    director: "M. Kouassi N'GUESSAN",
    icon: <Landmark className="text-blue-500" size={24} />,
    color: "blue",
    pendingDocs: 23,
    services: [
      { name: "Paiement Taxe Marché", desc: "Tickets journaliers et mensuels." },
      { name: "Publicité Foncière", desc: "Enseignes et panneaux publicitaires." },
      { name: "Droits de Stationnement", desc: "Abonnements Taxis et Gbakas." }
    ]
  },
  {
    id: "ddh",
    name: "Développement Humain (DDH)",
    director: "Mme. Aminata DIALLO",
    icon: <HeartHandshake className="text-purple-500" size={24} />,
    color: "purple",
    pendingDocs: 18,
    services: [
      { name: "Aide Sociale & Indigence", desc: "Certificats pour soins médicaux." },
      { name: "Bourses Communales", desc: "Soutien aux étudiants de la commune." },
      { name: "Subvention Association", desc: "Appui aux clubs sportifs et culturels." }
    ]
  },
  {
    id: "pm",
    name: "Police Municipale (PM)",
    director: "Cdt Lassina DIABATE",
    icon: <ShieldAlert className="text-red-500" size={24} />,
    color: "red",
    pendingDocs: 5,
    services: [
      { name: "Rapport de Nuisance", desc: "Plaintes pour tapage nocturne." },
      { name: "Sécurité des Marchés", desc: "Rapports de patrouille et saisies." }
    ]
  }
];

// --- 2. COMPOSANTS D'INTERFACE "PAPIER" ---
const PaperField = ({ label, value }: { label: string, value: string }) => (
  <div className="border-b border-slate-200 pb-2">
    <label className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] block">{label}</label>
    <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{value || "Non renseigné"}</p>
  </div>
);

const PaperSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h4 className="text-[9px] font-black text-orange-600 uppercase border-l-2 border-orange-500 pl-3 tracking-widest">{title}</h4>
    <div className="grid grid-cols-2 gap-6 pl-4">{children}</div>
  </div>
);

export default function MairieDepartments() {
  const [activeDirection, setActiveDirection] = useState<string>(DIRECTIONS[0].id);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [tickets, setTickets] = useState([1, 2, 3]);

  const activeData = DIRECTIONS.find(d => d.id === activeDirection) || DIRECTIONS[0];

  const handleAction = (id: number, type: 'APPROVE' | 'REJECT') => {
    toast.success(type === 'APPROVE' ? "SCELLÉ OFFICIEL APPOSÉ" : "DOSSIER CLASSÉ SANS SUITE", {
      style: { background: '#0f172a', color: type === 'APPROVE' ? '#10b981' : '#ef4444', fontWeight: 'bold' }
    });
    setTickets(prev => prev.filter(t => t !== id));
  };

  // --- 3. LOGIQUE MÉTIER : LE CONTENU DES DOSSIERS ---
  const renderDossierContent = () => {
    switch (selectedService) {
      // --- ÉTAT CIVIL ---
      case "Déclaration de Naissance":
        return (
          <div className="space-y-8">
            <PaperSection title="Identité de l'Enfant">
              <PaperField label="Nom Complet" value="KOUHAME KEVIN GAEL" />
              <PaperField label="Né le" value="19/03/2026 à 08:30" />
            </PaperSection>
            <PaperSection title="Filiation">
              <PaperField label="Père" value="KOUAME YAO" />
              <PaperField label="Mère" value="TOURE AMINATA" />
            </PaperSection>
          </div>
        );
      case "Célébration de Mariage":
        return (
          <div className="space-y-8">
            <PaperSection title="Futurs Époux">
              <PaperField label="Époux" value="TRAORE Moussa" />
              <PaperField label="Épouse" value="DIALLO Fatim" />
            </PaperSection>
            <PaperSection title="Cérémonie">
              <PaperField label="Date prévue" value="12 JUIN 2026" />
              <PaperField label="Régime Matrimonial" value="Communauté de biens" />
            </PaperSection>
          </div>
        );

      // --- URBANISME ---
      case "Permis de Construire":
        return (
          <div className="space-y-8">
            <PaperSection title="Détails du Projet">
              <PaperField label="Type" value="Immeuble R+4 avec sous-sol" />
              <PaperField label="Localisation" value="Yopougon Niangon Nord" />
            </PaperSection>
            <PaperSection title="Technique">
              <PaperField label="Architecte" value="Elite-Archi Studio" />
              <PaperField label="Surface Terrain" value="600 m²" />
            </PaperSection>
          </div>
        );

      // --- FINANCES ---
      case "Paiement Taxe Marché":
        return (
          <div className="space-y-8">
            <PaperSection title="Contribuable">
              <PaperField label="Nom Commerçant" value="Dame KOFFI Awa" />
              <PaperField label="N° Place" value="MARCHÉ-YOP-A14" />
            </PaperSection>
            <PaperSection title="Finances">
              <PaperField label="Montant Journalier" value="500 FCFA" />
              <PaperField label="Total à Recouvrer" value="15 000 FCFA (Mois)" />
            </PaperSection>
          </div>
        );

      // --- SOCIAL ---
      case "Bourses Communales":
        return (
          <div className="space-y-8">
            <PaperSection title="Étudiant">
              <PaperField label="Nom" value="SYLLA Aboubacar" />
              <PaperField label="Établissement" value="INP-HB Yamoussoukro" />
            </PaperSection>
            <PaperSection title="Critères">
              <PaperField label="Niveau" value="Master 2 Finance" />
              <PaperField label="Score Social" value="Indigence Niveau 2" />
            </PaperSection>
          </div>
        );

      // --- POLICE ---
      case "Rapport de Nuisance":
        return (
          <div className="space-y-8">
            <PaperSection title="Plaignant">
              <PaperField label="Déposé par" value="M. KONÉ Brahima" />
              <PaperField label="Quartier" value="Selmer - Cité Verte" />
            </PaperSection>
            <PaperSection title="Faits">
              <PaperField label="Nature" value="Nuisances sonores répétées (Maquis)" />
              <PaperField label="Heure Constat" value="23:45" />
            </PaperSection>
          </div>
        );

      default:
        return (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Examen du dossier en cours...</p>
          </div>
        );
    }
  };

  // --- 4. AFFICHAGE DU GUICHET ---
  if (selectedService) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 h-full flex flex-col bg-[#050810] min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <button onClick={() => setSelectedService(null)} className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase hover:text-orange-500 transition-all">
            <ArrowLeft size={16} /> Retour Organigramme
          </button>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-[10px] font-black text-blue-400 uppercase italic">Opérateur : {activeData.director.split(' ').pop()}</span>
            </div>
            <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase">Guichet Ouvert</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10 flex-1 min-h-0">
          {/* File d'attente */}
          <div className="col-span-3 space-y-4">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2"><Clock size={14}/> File de service</h3>
            <AnimatePresence>
              {tickets.map((t) => (
                <motion.div key={t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                  className={`p-6 rounded-[2.5rem] border ${t === tickets[0] ? 'bg-orange-600 border-orange-400 shadow-2xl' : 'bg-slate-900 border-white/5 opacity-40'}`}>
                  <span className="text-[9px] font-black text-white/60 uppercase">Ticket #00{t}</span>
                  <h4 className="text-xs font-black text-white uppercase mt-1">Usager ID-{t*102}</h4>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* BUREAU DU MAIRE / DOSSIER PAPIER */}
          <div className="col-span-9 bg-[#fdfdfd] rounded-[4rem] shadow-2xl relative flex flex-col border border-slate-300 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/notebook.png')]" />
            <div className="p-20 flex-1 flex flex-col relative z-10">
              
              {/* Entête Document d'État */}
              <div className="flex justify-between items-start mb-16 border-b-2 border-slate-200 pb-10">
                <div className="text-center w-36 uppercase text-[7px] font-black flex flex-col gap-1">
                  <p>République de Côte d'Ivoire</p>
                  <div className="h-0.5 bg-slate-800 w-full" />
                  <p className="italic text-slate-500">Union - Discipline - Travail</p>
                </div>
                <div className="text-center">
                  <h2 className="text-3xl font-serif font-black text-slate-800 uppercase tracking-tighter leading-none">{selectedService}</h2>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic">Validation Souveraine RecensCI</p>
                </div>
                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center opacity-60">
                   <QrCode size={40} className="text-slate-300"/>
                </div>
              </div>

              {/* Contenu de chaque service */}
              <div className="flex-1">
                {renderDossierContent()}
                
                {/* Visualisation de l'upload Cloudinary */}
                <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-between group hover:border-orange-500 transition-all cursor-pointer">
                   <div className="flex items-center gap-6">
                      <div className="p-4 bg-white rounded-2xl shadow-sm"><Smartphone size={24} className="text-orange-500" /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Document d'identité lié</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Hébergé sur le cloud souverain • Chiffrement 256bits</p>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-full hover:bg-orange-600 hover:text-white transition-all shadow-lg active:scale-95">Visualiser l'original</button>
                </div>
              </div>

              {/* TAMPON OFFICIEL */}
              <div className="mt-12 pt-10 border-t-2 border-dotted border-slate-200 flex justify-end gap-10">
                 <button onClick={() => handleAction(tickets[0], 'REJECT')} className="group flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full border-4 border-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"><XCircle size={36}/></div>
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.2em]">Refuser</span>
                 </button>
                 <button onClick={() => handleAction(tickets[0], 'APPROVE')} className="group flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-500/10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(16,185,129,0.2)]"><CheckCircle2 size={36}/></div>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Tamponner</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- VUE PAR DÉFAUT : ORGANIGRAMME ---
  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col min-h-screen">
      <header className="mb-12 flex justify-between items-end border-b border-orange-500/20 pb-10">
        <div>
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-5">
            <Building2 className="text-orange-500" size={48} />
            Hôtel de Ville <span className="text-orange-400">Services</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.5em] ml-1">Administration & Souveraineté Digitale</p>
        </div>
        <div className="flex gap-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] shadow-inner">
           <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recettes Communales</p>
              <p className="text-sm font-black text-blue-400">7 500 000 FCFA</p>
           </div>
           <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20"><TrendingUp size={24} /></div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">
        {/* Directions */}
        <div className="col-span-4 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
          {DIRECTIONS.map((dir) => (
            <button key={dir.id} onClick={() => setActiveDirection(dir.id)} className={`w-full p-8 rounded-[3.5rem] border transition-all text-left flex gap-6 items-center group ${activeDirection === dir.id ? 'bg-orange-600 border-orange-400 shadow-2xl' : 'bg-[#0f172a] border-white/5 hover:bg-white/5'}`}>
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-all ${activeDirection === dir.id ? 'bg-white/20 border-white/20 scale-110' : 'bg-black/20 border-white/10 group-hover:border-orange-500/30'}`}>
                {dir.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-black uppercase text-white mb-1 group-hover:tracking-widest transition-all">{dir.name}</h3>
                <p className={`text-[9px] font-black uppercase tracking-widest ${activeDirection === dir.id ? 'text-white/60' : 'text-slate-600'}`}>{dir.director}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Services */}
        <div className="col-span-8 bg-[#0f172a] border border-white/5 rounded-[4.5rem] p-12 flex flex-col shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Building2 size={350} /></div>
          {activeData && (
            <div className="h-full flex flex-col relative z-10">
              <div className="flex justify-between items-center mb-12 pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{activeData.name}</h2>
                  <p className="text-[11px] text-orange-400 font-bold uppercase mt-2">Sous la responsabilité de {activeData.director}</p>
                </div>
                <div className="text-right">
                  <span className="text-[3rem] font-black text-white leading-none tracking-tighter">{activeData.pendingDocs}</span>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">En attente</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 overflow-y-auto pr-3 custom-scrollbar flex-1">
                {activeData.services.map((service, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 p-8 rounded-[3rem] flex items-center justify-between group/card hover:bg-orange-500/5 hover:border-orange-500/30 transition-all">
                    <div className="max-w-[70%]">
                      <h4 className="text-lg font-black text-white uppercase mb-1 tracking-tight group-hover/card:text-orange-400 transition-colors">{service.name}</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{service.desc}</p>
                    </div>
                    <button onClick={() => setSelectedService(service.name)} className="flex items-center gap-4 px-10 py-5 bg-orange-600 text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl active:scale-95">
                      Ouvrir le Guichet <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}