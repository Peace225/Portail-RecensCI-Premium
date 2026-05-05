import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux'; 
import { RootState } from "../../../store"; 
import { 
  Building2, FileText, HardHat, Landmark, HeartHandshake, 
  ShieldAlert, ChevronRight, ArrowLeft, CheckCircle2, 
  XCircle, Clock, Smartphone, QrCode, Layers,
  User, FolderOpen, UserCog, Users, Leaf, Bus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- 1. GÉNÉRATEUR DE DONNÉES DYNAMIQUES (Simule la base de données Supabase) ---
const getDirectionsForCommune = (commune: string) => [
  {
    id: "dsa",
    name: "Direction des Services Administratifs",
    director: commune === "Cocody" ? "M. Jean KOUADIO" : "M. Bakary TOURE", 
    icon: <FileText size={32} />,
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
    borderClass: "border-blue-400/30",
    glowClass: "shadow-[0_0_30px_rgba(96,165,250,0.1)]",
    pendingDocs: Math.floor(Math.random() * 200) + 50, 
    services: [
      { 
        name: "Déclaration de Naissance", 
        desc: "Enregistrement sécurisé des nouveaux-nés.",
        chef: commune === "Cocody" ? "Mme. YACE" : "S. TRAORE",
        agents: [{ name: "Agt. Bamba", status: "online" }, { name: "Agt. Koné", status: "busy" }]
      },
      { 
        name: "Célébration de Mariage", 
        desc: "Dépôt de dossier et réservation de date.",
        chef: "A. DIALLO",
        agents: [{ name: "Agt. Yao", status: "online" }]
      },
      { 
        name: "Extrait d'Acte", 
        desc: "Délivrance certifiée d'actes.",
        chef: "K. N'GUESSAN",
        agents: [{ name: "Agt. Sylla", status: "offline" }, { name: "Agt. Cissé", status: "online" }]
      }
    ]
  },
  {
    id: "dst",
    name: "Direction des Services Techniques",
    director: commune === "Bouaké" ? "M. SANOGO" : "Mme. Fatoumata KONE",
    icon: <HardHat size={32} />,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    glowClass: "shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    pendingDocs: Math.floor(Math.random() * 100) + 20,
    services: [
      { 
        name: "Permis de Construire", 
        desc: "Approbation technique des plans.",
        chef: "P. KOFFI",
        agents: [{ name: "Agt. Ouattara", status: "online" }]
      },
      { 
        name: "Occupation Domaine Public", 
        desc: "Autorisation d'installation et voirie.",
        chef: "E. TAPE",
        agents: [{ name: "Agt. Diabaté", status: "online" }, { name: "Agt. Coulibaly", status: "busy" }]
      }
    ]
  },
  {
    id: "dtc",
    name: "Direction des Transports Communaux",
    director: "M. Cissé MAMADOU",
    icon: <Bus size={32} />,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    glowClass: "shadow-[0_0_30px_rgba(249,115,22,0.1)]",
    pendingDocs: 89,
    services: [
      { 
        name: "Autorisation Taxis & Gbakas", 
        desc: "Agréments de transporteurs et macarons.",
        chef: "M. KOUADIO",
        agents: [{ name: "Agt. Touré", status: "online" }, { name: "Agt. Fofana", status: "online" }]
      },
      { 
        name: "Gestion des Gares Routières", 
        desc: "Attribution des lignes et contrôle des syndicats.",
        chef: "L. DIARRASSOUBA",
        agents: [{ name: "Agt. Camara", status: "busy" }]
      }
    ]
  },
  {
    id: "dsf",
    name: "Direction des Services Financiers",
    director: "M. Kouassi N'GUESSAN",
    icon: <Landmark size={32} />,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    glowClass: "shadow-[0_0_30px_rgba(245,158,11,0.1)]",
    pendingDocs: 23,
    services: [
      { 
        name: "Paiement Taxe Marché", 
        desc: "Gestion des tickets journaliers et mensuels.",
        chef: "A. KOUASSI",
        agents: [{ name: "Agt. Koffi", status: "online" }]
      },
      { 
        name: "Publicité Foncière", 
        desc: "Taxation des enseignes et panneaux publicitaires.",
        chef: "B. N'DRI",
        agents: [{ name: "Agt. Dago", status: "offline" }]
      }
    ]
  },
  {
    id: "desu",
    name: "Direction Salubrité et Environnement",
    director: "M. Yapo KOUADIO",
    icon: <Leaf size={32} />,
    colorClass: "text-lime-500",
    bgClass: "bg-lime-500/10",
    borderClass: "border-lime-500/30",
    glowClass: "shadow-[0_0_30px_rgba(132,204,22,0.1)]",
    pendingDocs: 34,
    services: [
      { 
        name: "Contrôle Hygiène (Maquis)", 
        desc: "Inspection sanitaire des commerces alimentaires.",
        chef: "S. KOFFI",
        agents: [{ name: "Agt. Diomandé", status: "online" }]
      },
      { 
        name: "Gestion des Déchets", 
        desc: "Coordination pré-collecte et curage caniveaux.",
        chef: "M. GUEI",
        agents: [{ name: "Agt. Soro", status: "busy" }]
      }
    ]
  },
  {
    id: "ddh",
    name: "Développement Humain (DDH)",
    director: "Mme. Aminata DIALLO",
    icon: <HeartHandshake size={32} />,
    colorClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.1)]",
    pendingDocs: 18,
    services: [
      { 
        name: "Aide Sociale & Indigence", 
        desc: "Évaluation et certificats pour soins médicaux.",
        chef: "F. KONE",
        agents: [{ name: "Agt. N'Dri", status: "online" }]
      }
    ]
  },
  {
    id: "pm",
    name: "Police Municipale",
    director: "Cdt Lassina DIABATE",
    icon: <ShieldAlert size={32} />,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    glowClass: "shadow-[0_0_30px_rgba(244,63,94,0.1)]",
    pendingDocs: 5,
    services: [
      { 
        name: "Rapport de Nuisance", 
        desc: "Gestion des plaintes pour tapage et troubles.",
        chef: "Ltn. GBA",
        agents: [{ name: "Agt. Ouéhi", status: "online" }]
      }
    ]
  }
];

// --- 2. COMPOSANTS D'INTERFACE "PAPIER" ---
const PaperField = ({ label, value }: { label: string, value: string }) => (
  <div className="border-b border-slate-300/50 pb-2">
    <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">{label}</label>
    <p className="text-sm font-bold text-slate-800 tracking-tight">{value || "Non renseigné"}</p>
  </div>
);

const PaperSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-5">
    <h4 className="text-[10px] font-black text-amber-600 uppercase border-l-4 border-amber-500 pl-3 tracking-widest">{title}</h4>
    <div className="grid grid-cols-2 gap-8 pl-4">{children}</div>
  </div>
);

export default function MairieDepartments() {
  // 👉 1. On récupère le profil utilisateur stocké dans Redux
  const userState = useSelector((state: RootState) => state.user);

  // 👉 2. Récupération dynamique de la commune (Redux -> LocalStorage -> Défaut)
  const communeName = (userState?.commune && userState.commune !== "Inconnue") 
    ? userState.commune 
    : (localStorage.getItem('commune_secours') || "Yopougon");

  // On génère l'organigramme en fonction de la commune
  const directionsList = useMemo(() => getDirectionsForCommune(communeName), [communeName]);

  const [activeDirection, setActiveDirection] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [tickets, setTickets] = useState([1, 2, 3]);

  const activeData = activeDirection ? directionsList.find(d => d.id === activeDirection) || directionsList[0] : null;

  const handleAction = (id: number, type: 'APPROVE' | 'REJECT') => {
    toast.success(type === 'APPROVE' ? "SCELLÉ OFFICIEL APPOSÉ" : "DOSSIER CLASSÉ SANS SUITE", {
      style: { background: '#0f172a', color: type === 'APPROVE' ? '#10b981' : '#ef4444', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }
    });
    setTickets(prev => prev.filter(t => t !== id));
  };

  const renderDossierContent = () => {
    switch (selectedService) {
      case "Déclaration de Naissance":
        return (
          <div className="space-y-10">
            <PaperSection title={`Mairie de ${communeName} - Identité Enfant`}>
              <PaperField label="Nom Complet" value="KOUHAME KEVIN GAEL" />
              <PaperField label="Lieu de Naissance" value={`CHU de ${communeName}`} />
            </PaperSection>
            <PaperSection title="Filiation">
              <PaperField label="Père" value="KOUAME YAO" />
              <PaperField label="Mère" value="TOURE AMINATA" />
            </PaperSection>
          </div>
        );
      case "Autorisation Taxis & Gbakas":
        return (
          <div className="space-y-10">
            <PaperSection title="Identité du Chauffeur">
              <PaperField label="Nom Complet" value="SYLLA ABOUBACAR" />
              <PaperField label="Permis de Conduire" value="Catégorie Toutes (Validé)" />
            </PaperSection>
            <PaperSection title="Détails du Véhicule (Gbaka)">
              <PaperField label="Immatriculation" value="4592 KN 01" />
              <PaperField label="Ligne d'exploitation" value={`Gare de ${communeName} - Adjamé`} />
            </PaperSection>
          </div>
        );
      default:
        return (
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50">
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Examen du dossier en cours...</p>
          </div>
        );
    }
  };

  // ==========================================
  // NIVEAU 3 : LE GUICHET (Dossier Papier)
  // ==========================================
  if (selectedService && activeData) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 h-full flex flex-col min-h-screen">
        <header className="flex justify-between items-center mb-8 bg-[#050914] p-4 rounded-3xl border border-white/5 shadow-lg">
          <button onClick={() => setSelectedService(null)} className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-amber-500 bg-white/5 hover:bg-amber-500/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest">
            <ArrowLeft size={16} /> Retour à l'Organigramme
          </button>
          <div className="flex items-center gap-4">
            <div className="px-5 py-2.5 bg-[#020617] border border-white/10 rounded-xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mairie de <span className="text-amber-500">{communeName}</span></span>
            </div>
            <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Guichet Ouvert</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6 ml-2">
              <Clock size={14} className="text-amber-500"/> File de traitement
            </h3>
            <AnimatePresence>
              {tickets.length === 0 ? (
                <div className="text-center p-8 border border-white/5 rounded-3xl bg-white/5">
                  <p className="text-xs text-slate-500 font-bold">Aucun dossier en attente.</p>
                </div>
              ) : (
                tickets.map((t, index) => (
                  <motion.div key={t} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-6 rounded-[2rem] border transition-all ${index === 0 ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-[#050914] border-white/5 opacity-60'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ticket #{String(t).padStart(3, '0')}</span>
                      {index === 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />}
                    </div>
                    <h4 className={`text-sm font-black uppercase ${index === 0 ? 'text-amber-400' : 'text-white'}`}>Usager ID-{t*102}</h4>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="col-span-12 lg:col-span-9 bg-[#f8fafc] rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
            <div className="p-12 md:p-16 flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-16 border-b-2 border-slate-800 pb-10">
                <div className="text-center w-40 uppercase text-[9px] font-black flex flex-col gap-1.5 text-slate-800">
                  <p>République de Côte d'Ivoire</p>
                  <div className="h-[3px] bg-slate-800 w-full" />
                  <p className="italic text-slate-500 text-[7px] tracking-widest mt-1">Commune de {communeName}</p>
                </div>
                <div className="text-center flex-1 px-8">
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900 uppercase tracking-tight">{selectedService}</h2>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mt-3 bg-amber-100 inline-block px-4 py-1 rounded-full">Procédure Numérique Officielle</p>
                </div>
                <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-inner">
                   <QrCode size={48} className="text-slate-800"/>
                </div>
              </div>

              <div className="flex-1 max-w-4xl mx-auto w-full">
                {renderDossierContent()}
              </div>

              <div className="mt-16 pt-8 border-t-2 border-dashed border-slate-300 flex justify-end gap-6">
                 <button onClick={() => handleAction(tickets[0], 'REJECT')} disabled={tickets.length === 0} className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-rose-200 text-rose-600 rounded-2xl hover:bg-rose-50 hover:border-rose-300 transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50">
                    <XCircle size={20}/> Rejeter
                 </button>
                 <button onClick={() => handleAction(tickets[0], 'APPROVE')} disabled={tickets.length === 0} className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-50 transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-600/20 disabled:opacity-50">
                    <CheckCircle2 size={20}/> Valider & Tamponner
                 </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ==========================================
  // NIVEAU 2 : VUE D'UNE DIRECTION (Organigramme)
  // ==========================================
  if (activeData) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
        <header className="mb-12 flex justify-between items-center border-b border-white/5 pb-6">
          <button onClick={() => setActiveDirection(null)} className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-black text-[10px] uppercase tracking-widest transition-colors">
            <ArrowLeft size={16} /> Retour aux Directions
          </button>
          <div className="bg-[#050914] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 text-right">Mairie de {communeName}</p>
              <span className="text-2xl font-black text-white">{activeData.pendingDocs} Dossiers</span>
            </div>
            <Layers className="text-amber-500" size={24} />
          </div>
        </header>

        {/* --- DÉBUT ORGANIGRAMME --- */}
        <div className="flex flex-col items-center relative pb-20">
          
          {/* NŒUD CENTRAL : LE DIRECTEUR */}
          <div className="bg-[#050914] border border-white/10 rounded-[3rem] p-8 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-20 flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${activeData.bgClass} ${activeData.colorClass} border border-white/10`}>
              {activeData.icon}
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{activeData.name}</h1>
            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
              <UserCog size={16} />
              <p className="text-xs font-black uppercase tracking-widest">Directeur : {activeData.director}</p>
            </div>
          </div>

          {/* LIGNE VERTICALE DE L'ORGANIGRAMME */}
          <div className="w-px h-16 bg-gradient-to-b from-white/20 to-white/5 relative z-10" />

          {/* GRILLE DES SERVICES (Chefs & Agents) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full relative z-20">
            {/* Ligne horizontale de connexion */}
            <div className="hidden xl:block absolute top-0 left-[16.66%] right-[16.66%] h-px bg-white/10 -mt-px" />

            {activeData.services.map((service, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                <div className="hidden xl:block w-px h-6 bg-white/10 absolute -top-6" />

                <div className="bg-[#050914] border border-white/5 rounded-[2.5rem] w-full shadow-2xl flex flex-col overflow-hidden hover:border-amber-500/30 transition-colors group">
                  
                  {/* Tête de Service (Chef) */}
                  <div className="p-6 border-b border-white/5 bg-black/40 text-center">
                    <h4 className="text-sm font-black text-white uppercase mb-4 tracking-tight">{service.name}</h4>
                    <div className="flex items-center justify-center gap-2 text-slate-300">
                      <User size={14} className="text-blue-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Chef: <span className="text-blue-400">{service.chef}</span></p>
                    </div>
                  </div>

                  {/* Corps du Service (Agents) */}
                  <div className="p-6 flex-1 bg-[#020617]">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Users size={12}/> Équipe Opérationnelle
                    </p>
                    <div className="space-y-3">
                      {service.agents.map((agent, aIdx) => (
                        <div key={aIdx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                          <span className="text-xs font-bold text-slate-300">{agent.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                            <span className="text-[8px] font-black uppercase text-slate-500">{agent.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedService(service.name)} 
                    className="w-full p-5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-amber-400 transition-colors"
                  >
                    Ouvrir ce Guichet <ChevronRight size={16} />
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    );
  }

  // ==========================================
  // NIVEAU 1 : VUE GLOBALE (Grille des Directions)
  // ==========================================
  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-4">
            <Building2 className="text-amber-500" size={36} />
            Mairie de <span className="text-amber-500">{communeName}</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-1">Départements & Organigramme</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {directionsList.map((dir, index) => (
          <motion.button 
            key={dir.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveDirection(dir.id)} 
            className={`text-left p-8 bg-[#050914] border border-white/5 rounded-[3rem] group transition-all hover:-translate-y-2 hover:${dir.glowClass} hover:${dir.borderClass}`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${dir.bgClass} ${dir.colorClass}`}>
                {dir.icon}
              </div>
            </div>
            
            <h3 className="text-xl font-black uppercase text-white mb-2 group-hover:text-slate-200 transition-colors">
              {dir.name}
            </h3>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2 text-amber-500">
                 <UserCog size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-amber-500 transition-colors">Dir: {dir.director}</span>
               </div>
               <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}