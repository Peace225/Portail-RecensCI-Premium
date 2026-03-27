import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Baby, FileText, Heart, ShieldCheck, 
  ArrowRight, Globe, Fingerprint, Lock, 
  Zap, Map, Users, BarChart3, Cpu, Brain, Activity, Database, Server,
  MessageSquare, X, Bot, Sparkles, Send, Terminal
} from "lucide-react";

// --- ANIMATIONS CSS ---
const styles = `
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-marquee { animation: marquee 30s linear infinite; }
  @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
  .animate-scan { animation: scan 3s linear infinite; }
  @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }
  .animate-pulse-ring { animation: pulse-ring 2s infinite; }
  .cyber-grid { background-image: linear-gradient(to right, rgba(255,130,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,130,0,0.05) 1px, transparent 1px); background-size: 40px 40px; }
  .glass-panel { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
`;

const Home: React.FC = () => {
  const [population, setPopulation] = useState(29389142);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Historique des messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "SYSTÈME INITIALISÉ. Je suis l'assistant RecensCI. Comment puis-je vous aider ?", time: new Date().toLocaleTimeString() }
  ]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  useEffect(() => {
    const popInterval = setInterval(() => setPopulation(p => p + 1), 5000);
    return () => clearInterval(popInterval);
  }, []);

  // Logique de réponse de l'IA
  const handleAiResponse = (userText: string) => {
    setIsAiTyping(true);
    
    setTimeout(() => {
      let response = "ANALYSE EN COURS... Commande non répertoriée. Veuillez reformuler ou contacter le support technique.";
      
      const text = userText.toLowerCase();
      if (text.includes("enregistrer") || text.includes("recensement")) {
        response = "PROTOCOLE : Pour vous enregistrer, munissez-vous de votre acte de naissance. Cliquez sur le bouton 'INITIALISER' en haut de la page.";
      } else if (text.includes("certificat") || text.includes("vérifier")) {
        response = "VÉRIFICATION : Accès au registre biométrique... Veuillez scanner le QR Code présent sur votre document physique.";
      } else if (text.includes("sécurité") || text.includes("données")) {
        response = "INFRASTRUCTURE : Vos données sont cryptées en AES-512 et stockées sur les serveurs souverains de la République.";
      }

      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: response, 
        time: new Date().toLocaleTimeString() 
      }]);
      setIsAiTyping(false);
    }, 1500);
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
          {[1, 2].map((_, i) => (
            <div key={i} className="flex gap-12 text-[9px] font-mono font-bold tracking-[0.2em] text-orange-400 uppercase">
              <span>● STATUT : OPÉRATIONNEL</span> <span>● IA : ACTIVE</span> <span>● SÉCURITÉ : NIVEAU 5</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- HERO --- */}
      <section className="relative pt-44 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 flex items-center justify-center overflow-hidden min-h-screen">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-10">
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                Recensement <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-orange-500">Numérique</span>
              </h1>
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-orange-500 max-w-md">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Population estimée (Live)</p>
                <span className="text-4xl font-mono font-black text-white">{population.toLocaleString()}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="px-10 py-5 bg-orange-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded shadow-[0_0_30px_rgba(234,88,12,0.4)]">Initialiser</Link>
                <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-[0.3em] rounded backdrop-blur-md">Vérifier ID</button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative glass-panel p-4 rounded-[2rem] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500 shadow-[0_0_15px_#FF8200] z-20 animate-scan"></div>
                <img src="/images/carte.png" alt="Map HUD" className="w-full brightness-110 contrast-125" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AICard icon={<Database />} title="DATA CORE" tag="AES-512" />
          <AICard icon={<Brain />} title="ANALYSIS IA" tag="PREDICTIVE" />
          <AICard icon={<Server />} title="SOUVERAIN" tag="LOCAL" />
          <AICard icon={<Lock />} title="SÉCURITÉ" tag="NIVEAU 5" />
        </div>
      </section>

      {/* --- CHATBOT IA FONCTIONNEL --- */}
      <div className="fixed bottom-6 right-6 z-[200]">
        {isChatOpen ? (
          <div className="w-[320px] md:w-[400px] glass-panel rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-orange-500/20">
            {/* Header */}
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

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/50 font-mono text-[11px]">
              {messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${m.sender === 'user' ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-orange-400 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[8px] text-slate-600 mt-1 uppercase">{m.time}</span>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex items-center gap-2 text-orange-500 animate-pulse">
                  <Terminal size={12} />
                  <span>Analyse du flux de données...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-4 bg-slate-900/80 border-t border-white/5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {["Comment s'enregistrer ?", "Sécurité des données"].map((s, idx) => (
                  <button key={idx} onClick={() => { setInputValue(s); }} className="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded hover:border-orange-500 transition-colors uppercase font-bold">
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2">
                <input 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  type="text" 
                  placeholder="Tapez une commande..." 
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
            className="group relative w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(234,88,12,0.4)]"
          >
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-pulse-ring"></div>
            <MessageSquare className="relative z-10 group-hover:scale-110 transition-transform" size={28} />
          </button>
        )}
      </div>
    </div>
  );
};

const AICard = ({ icon, title, tag }: any) => (
  <div className="glass-panel group p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2">
    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center mb-6">
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