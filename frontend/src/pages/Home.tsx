import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Baby, FileText, Heart, ShieldCheck, 
  ArrowRight, Globe, Fingerprint, Lock, 
  Zap, Map, Users, BarChart3, Cpu, Brain, Activity, Database, Server,
  MessageSquare, X, Bot, Sparkles, Send, Terminal
} from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const activityData = [
  { time: '08:00', requetes: 1200 },
  { time: '10:00', requetes: 3500 },
  { time: '12:00', requetes: 2800 },
  { time: '14:00', requetes: 5000 },
  { time: '16:00', requetes: 4200 },
  { time: '18:00', requetes: 6800 },
  { time: '20:00', requetes: 3100 },
];

const regionalData = [
  { name: 'Abidjan', pop: 6300 },
  { name: 'Bouaké', pop: 1500 },
  { name: 'Daloa', pop: 800 },
  { name: 'Korhogo', pop: 600 },
  { name: 'San Pédro', pop: 500 },
];

const styles = `
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-marquee { animation: marquee 30s linear infinite; }
  @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
  .animate-scan { animation: scan 3s linear infinite; }
  @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
  .animate-pulse-ring { animation: pulse-ring 2s infinite; }
  .cyber-grid { background-image: linear-gradient(to right, rgba(255,130,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,130,0,0.05) 1px, transparent 1px); background-size: 40px 40px; }
  .glass-panel { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
  .custom-tooltip { background: rgba(0,0,0,0.8); border: 1px solid #FF8200; padding: 10px; border-radius: 8px; font-family: monospace; }
`;

const Home: React.FC = () => {
  const targetPopulation = 29389142;
  const [population, setPopulation] = useState(0); 
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "SYSTÈME INITIALISÉ. Je suis l'assistant RecensCI. Posez-moi vos questions sur le recensement, l'enrôlement de votre famille ou le suivi de vos requêtes.", time: new Date().toLocaleTimeString() }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const incrementAmount = targetPopulation / steps;

    const timer = setInterval(() => {
      start += incrementAmount;
      if (start >= targetPopulation) {
        clearInterval(timer);
        setPopulation(targetPopulation);
        setInterval(() => {
          setPopulation(p => p + Math.floor(Math.random() * 3) + 1);
        }, 3000);
      } else {
        setPopulation(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, []);

  // --- LOGIQUE DE L'IA ÉLARGIE ---
  const handleAiResponse = (userText: string) => {
    setIsAiTyping(true);
    setTimeout(() => {
      let response = "COMMANDE NON RECONNUE. Je peux vous aider pour : le NNI, la perte de carte, l'enrôlement de vos enfants, le suivi de votre dossier, ou la résolution de blocages.";
      const text = userText.toLowerCase();

      // Enrôlement de base
      if (text.includes("enregistrer") || text.includes("recensement") && !text.includes("famille") && !text.includes("enfant")) {
        response = "PROTOCOLE D'ENRÔLEMENT : Tout citoyen doit s'inscrire au RNPP (Registre National). Présentez un extrait d'acte de naissance, un certificat de nationalité ou une pièce d'identité valide dans un centre agréé. Cliquez sur 'INITIALISER' en haut pour débuter.";
      } 
      // NNI
      else if (text.includes("nni") || text.includes("numero national")) {
        response = "INFO NNI : Le Numéro National d'Identification (NNI) est un numéro unique à 11 chiffres. Il vous est attribué à vie dès votre premier enrôlement biométrique par l'ONECI.";
      }
      // Famille & Enfants
      else if (text.includes("famille") || text.includes("enfant") || text.includes("bébé") || text.includes("fils") || text.includes("fille")) {
        response = "ENRÔLEMENT FAMILIAL : Pour recenser vos enfants, vous devez présenter leurs extraits d'acte de naissance, votre propre pièce d'identité (ou NNI), et le livret de famille. La présence physique des enfants de plus de 5 ans est obligatoire pour la prise d'empreintes et la photo.";
      }
      // Blocages & Erreurs
      else if (text.includes("bloqué") || text.includes("erreur") || text.includes("rejet") || text.includes("doublon") || text.includes("empreinte")) {
        response = "ASSISTANCE BLOCAGE : Si votre dossier est rejeté (ex: doublon suspecté, erreur sur le nom, empreintes illisibles), un agent de réclamation doit intervenir. Veuillez vous rendre à l'agence ONECI principale de votre commune avec vos justificatifs originaux pour une mise à jour ou un forçage biométrique.";
      }
      // Modification des données
      else if (text.includes("modifier") || text.includes("changement") || text.includes("mariage") || text.includes("déménagement") || text.includes("adresse")) {
        response = "MISE À JOUR DU PROFIL : Pour déclarer un mariage ou un changement d'adresse, connectez-vous avec votre NNI. Allez dans 'Citoyen > Changement d'adresse' ou 'État civil', remplissez le formulaire et téléversez la preuve (acte de mariage, certificat de résidence).";
      }
      // Retard & Suivi de carte
      else if (text.includes("retard") || text.includes("attente") || text.includes("pas prête") || text.includes("toujours pas") || text.includes("statut")) {
        response = "SUIVI DE DOSSIER : Si votre carte est 'En attente' depuis plus de 45 jours, il s'agit souvent d'une vérification approfondie pour litige d'état civil. Vous pouvez vérifier le statut exact dans votre tableau de bord ou appeler le numéro vert 1336.";
      }
      // Perte & Vol
      else if (text.includes("perdu") || text.includes("perte") || text.includes("vol")) {
        response = "PROCÉDURE DE PERTE : 1. Faites une déclaration de perte au commissariat. 2. Achetez un timbre d'enrôlement en ligne (5000 FCFA). 3. Rendez-vous dans un centre avec votre NNI et la déclaration pour commander un duplicata.";
      }
      // ONECI
      else if (text.includes("oneci")) {
        response = "STRUCTURE : L'ONECI (Office National de l'État Civil et de l'Identification) est l'institution chargée de la mise en œuvre du registre national en Côte d'Ivoire.";
      }
      // Démographie
      else if (text.includes("population") || text.includes("combien") || text.includes("habitants")) {
        response = "DONNÉES DÉMOGRAPHIQUES : Selon les projections du RGPH 2021 actualisées, la population de la Côte d'Ivoire avoisine les 29,3 millions d'habitants.";
      }
      // Étrangers / Résidents
      else if (text.includes("étranger") || text.includes("resident") || text.includes("résident")) {
        response = "LOI SUR LES RÉSIDENTS : Les ressortissants étrangers résidant en Côte d'Ivoire doivent s'enrôler pour obtenir une Carte de Résident Biométrique. Cela nécessite un passeport valide et une preuve de résidence.";
      }
      // Vérification
      else if (text.includes("certificat") || text.includes("vérifier") || text.includes("identité")) {
        response = "VÉRIFICATION : Connexion au registre central... Pour vérifier une identité, veuillez scanner le QR Code au dos de la carte biométrique ou saisir le NNI à 11 chiffres dans le terminal prévu à cet effet.";
      } 
      // Sécurité
      else if (text.includes("sécurité") || text.includes("données") || text.includes("piratage")) {
        response = "INFRASTRUCTURE : Vos données biométriques sont cryptées en norme AES-512. Elles sont stockées localement sur les serveurs souverains sécurisés à Abidjan et ne sont pas partagées avec des tiers sans autorisation légale.";
      }

      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: response, time: new Date().toLocaleTimeString() }]);
      setIsAiTyping(false);
    }, 1200);
  };

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue("");
    handleAiResponse(currentInput);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-300 selection:bg-orange-500/40 font-sans">
      <style>{styles}</style>

      {/* --- TICKER --- */}
      <div className="w-full bg-orange-600/10 border-b border-orange-500/20 py-1.5 overflow-hidden sticky top-0 z-[100] backdrop-blur-md">
        <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex gap-12 text-[9px] font-mono font-bold tracking-[0.2em] text-orange-400 uppercase">
              <span>● STATUT : OPÉRATIONNEL</span> <span>● IA : ACTIVE</span> <span>● SÉCURITÉ : NIVEAU 5</span> <span>● DATA : CHIFFRÉE</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- HERO --- */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                Recensement <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-orange-500">Numérique</span>
              </h1>
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500 max-w-md shadow-[0_0_30px_rgba(234,88,12,0.1)]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Activity size={12} className="text-orange-500 animate-pulse" /> 
                  Population estimée (Live)
                </p>
                <span className="text-4xl md:text-5xl font-mono font-black text-white tracking-tight">
                  {population.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="px-10 py-5 bg-orange-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:bg-orange-500 transition-colors">
                  Initialiser
                </Link>
                <button 
                  onClick={() => {
                    setIsChatOpen(true);
                    const autoMsg = "Je souhaite vérifier mon identité";
                    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: autoMsg, time: new Date().toLocaleTimeString() }]);
                    handleAiResponse(autoMsg);
                  }}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] rounded backdrop-blur-md hover:bg-white/10 transition-colors shadow-lg hover:shadow-orange-500/20"
                >
                  Vérifier ID
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative glass-panel p-4 rounded-[2rem] overflow-hidden border border-orange-500/30">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500 shadow-[0_0_15px_#FF8200] z-20 animate-scan"></div>
                <img src="/images/carte.png" alt="Map HUD" className="w-full brightness-110 contrast-125 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES & GRAPHIQUES --- */}
      <section className="py-12 container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AICard icon={<Database />} title="DATA CORE" tag="AES-512" color="text-orange-500" />
          <AICard icon={<Brain />} title="ANALYSIS IA" tag="PREDICTIVE" color="text-blue-500" />
          <AICard icon={<Server />} title="SOUVERAIN" tag="LOCAL" color="text-emerald-500" />
          <AICard icon={<Lock />} title="SÉCURITÉ" tag="NIVEAU 5" color="text-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-orange-500" size={24} />
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Flux Réseau</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Requêtes par heure</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequetes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8200" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#FF8200" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255, 130, 0, 0.5)', borderRadius: '8px' }}
                    itemStyle={{ color: '#FF8200', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="requetes" stroke="#FF8200" strokeWidth={3} fillOpacity={1} fill="url(#colorRequetes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-emerald-500" size={24} />
              <div>
                <h3 className="text-lg font-black text-white italic uppercase">Densité Régionale</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">En milliers d'habitants</p>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(16, 185, 129, 0.5)', borderRadius: '8px' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="pop" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* --- CHATBOT IA FONCTIONNEL --- */}
      <div className="fixed bottom-6 right-6 z-[200]">
        {isChatOpen ? (
          <div className="w-[320px] md:w-[400px] glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-orange-500/20">
            <div className="bg-orange-600 p-4 flex justify-between items-center border-b border-orange-400/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/20 rounded-lg animate-pulse"><Bot size={18} className="text-white" /></div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Assistant Holo-Core</p>
                  <p className="text-[8px] text-orange-200 font-mono">STATUS: SYNC_READY</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:rotate-90 transition-transform"><X size={20} /></button>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/50 font-mono text-[11px]">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${m.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-orange-400 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-600 mt-1 uppercase">{m.time}</span>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                  <Terminal size={12} />
                  <span>Recherche dans la base RNPP...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-slate-900/80 border-t border-white/5 space-y-3">
              {/* --- BOUTONS DE SUGGESTIONS --- */}
              <div className="flex flex-wrap gap-2">
                {["Recenser mon enfant", "Dossier bloqué", "Ma carte est en retard"].map((s, idx) => (
                  <button key={idx} onClick={() => { setInputValue(s); }} className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded hover:border-orange-500 hover:text-orange-400 transition-colors uppercase font-bold">
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  type="text" 
                  placeholder="Posez votre question..." 
                  className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono focus:border-orange-500 outline-none"
                />
                <button type="submit" className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-shadow shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="group relative w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:bg-orange-500 transition-colors"
          >
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-pulse-ring"></div>
            <MessageSquare className="relative z-10 group-hover:scale-110 transition-transform" size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

const AICard = ({ icon, title, tag, color = "text-orange-500" }: any) => (
  <div className="glass-panel group p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
    <div className={`w-12 h-12 bg-white/5 ${color} rounded-lg flex items-center justify-center mb-6`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-lg font-black text-white mb-2 italic uppercase">{title}</h3>
    <p className="text-[10px] text-slate-500 font-bold mb-4 uppercase tracking-widest">{tag}</p>
    <div className="h-[1px] w-full bg-white/5"></div>
    <div className="mt-4 flex justify-between items-center text-[8px] font-mono text-emerald-500">
      <span>SYNC_ACTIVE</span>
      <div className="flex gap-0.5 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-emerald-500 rounded-full"></div>)}
      </div>
    </div>
  </div>
);

export default Home;