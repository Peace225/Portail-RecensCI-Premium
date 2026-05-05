import React, { useState } from 'react';
import { Send, Lock, ShieldCheck, Search, MessageSquare, AlertTriangle } from 'lucide-react';

const CHATS = [
  { id: 1, name: "KOFFI Alain", lastMsg: "Zone sécurisée, enrôlement en cours.", time: "10:42", unread: 0, status: "online" },
  { id: 2, name: "ÉQUIPE ALPHA - Yopougon", lastMsg: "Besoin de batteries supplémentaires.", time: "10:15", unread: 2, status: "alert" },
  { id: 3, name: "TOURE Mariam", lastMsg: "Fin de service confirmée.", time: "Hier", unread: 0, status: "offline" },
];

export default function AgentMessages() {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
            <MessageSquare className="text-purple-500" size={32} />
            Messagerie <span className="text-cyan-400">Opérationnelle</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Canal chiffré de bout en bout (AES-256)</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Réseau Sécurisé</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Left Sidebar (Contacts) */}
        <div className="col-span-4 border-r border-white/5 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="text" placeholder="RECHERCHER AGENT..." className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors uppercase" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {CHATS.map(chat => (
              <div key={chat.id} onClick={() => setActiveChat(chat)} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${activeChat.id === chat.id ? 'bg-purple-500/10 border-l-2 border-l-purple-500' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-xs font-black uppercase ${activeChat.id === chat.id ? 'text-white' : 'text-slate-300'}`}>{chat.name}</h4>
                  <span className="text-[9px] text-slate-500 font-mono">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 truncate pr-4">{chat.lastMsg}</p>
                  {chat.unread > 0 && <span className="bg-purple-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">{chat.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area (Chat) */}
        <div className="col-span-8 flex flex-col relative">
          <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{activeChat.name}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1"><Lock size={10} /> Canal Chiffré</p>
            </div>
            {activeChat.status === 'alert' && (
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1 rounded text-[9px] font-black uppercase flex items-center gap-2"><AlertTriangle size={12}/> Alerte Active</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Mock messages */}
            <div className="flex justify-center mb-6">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">Aujourd'hui</span>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <div className="bg-slate-800/80 text-white p-3 rounded-2xl rounded-tl-sm text-sm border border-white/5 max-w-[80%]">Superviseur, nous avons un problème avec la tablette T-45.</div>
              <span className="text-[9px] text-slate-500 font-mono ml-1">10:12</span>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <div className="bg-purple-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-[0_0_15px_rgba(168,85,247,0.3)] max-w-[80%]">Bien reçu. Restez sur place, je déclenche le protocole de diagnostic à distance.</div>
              <span className="text-[9px] text-purple-400/60 font-mono mr-1">10:14</span>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-black/40">
            <div className="relative flex items-center">
              <input 
                type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="TRANSMETTRE UN ORDRE..." 
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors uppercase"
              />
              <button className="absolute right-2 bg-purple-600 hover:bg-purple-500 p-2 rounded-lg text-white transition-colors shadow-lg">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}