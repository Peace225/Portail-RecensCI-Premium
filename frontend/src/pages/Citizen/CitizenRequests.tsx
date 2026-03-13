// src/pages/Citizen/CitizenRequests.tsx
import React, { useState } from "react";
import { 
  Clock, CheckCircle2, AlertCircle, FileText, 
  ChevronRight, Download, Eye, QrCode, X, Printer 
} from "lucide-react";

// On simule une base de données enrichie
const requests = [
  { id: "REQ-892", type: "Extrait d'Acte de Naissance", date: "10 Mars 2026", status: "En cours", step: 2, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "REQ-451", type: "Certificat de Résidence", date: "02 Fév 2026", status: "Validé", step: 3, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "REQ-120", type: "Certificat de Nationalité", date: "20 Jan 2026", status: "Rejeté", step: 1, color: "text-red-600", bg: "bg-red-50" },
];

const CitizenRequests: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Mes Documents</h2>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-1">Coffre-fort numérique citoyen</p>
        </div>
        <div className="hidden md:flex gap-2">
            <span className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">Total : {requests.length}</span>
        </div>
      </div>

      {/* LISTE DES DEMANDES */}
      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => (
          <div 
            key={req.id} 
            className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
            onClick={() => req.status === "Validé" && setSelectedDoc(req)}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[1.5rem] ${req.bg} ${req.color} flex items-center justify-center shadow-inner`}>
                  <FileText size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{req.type}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{req.id}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col items-end gap-2">
                   <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${req.bg} ${req.color}`}>
                    {req.status}
                   </span>
                   {req.status === "Validé" && (
                     <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                       <QrCode size={12} /> Prêt pour téléchargement
                     </span>
                   )}
                </div>
                <ChevronRight size={20} className="text-slate-200 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE VISUALISATION DE L'ACTE (SIMULATION) */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            
            {/* Barre de contrôle */}
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic">Aperçu du Document Officiel</h3>
                <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-red-500">
                    <X size={24} />
                </button>
            </div>

            {/* Corps de l'acte */}
            <div className="p-10 md:p-16 space-y-10 text-center font-serif relative">
                <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
                    <ShieldCheck size={120} className="text-slate-900" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl font-bold uppercase tracking-widest">République de Côte d'Ivoire</h1>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Union - Discipline - Travail</p>
                </div>

                <div className="py-8 border-y-2 border-slate-900 space-y-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">{selectedDoc.type}</h2>
                    <p className="font-sans text-xs text-slate-500">N° DE RÉFÉRENCE : {selectedDoc.id}</p>
                </div>

                <div className="font-sans text-sm text-slate-700 leading-relaxed text-left space-y-4 py-4">
                    <p>Le Ministre de l'Intérieur et de la Sécurité certifie par la présente que les informations relatives au citoyen <strong>KOUAME Gael Kevin</strong>, enregistrées sous l'identifiant social <strong>CI-0102938475</strong>, sont conformes aux registres du recensement national.</p>
                </div>

                <div className="flex justify-between items-end pt-10 font-sans">
                    <div className="text-left space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400">Authenticité Digitale</p>
                        <div className="w-24 h-24 bg-slate-100 flex items-center justify-center border-2 border-slate-900 rounded-xl">
                            <QrCode size={60} />
                        </div>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] font-black uppercase text-slate-400 mb-6">Signature de l'Officier</p>
                         <div className="italic font-black text-slate-900 border-b border-slate-900 inline-block px-4 py-2">RecensCI System</div>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-8 bg-slate-900 flex gap-4">
                <button className="flex-1 py-4 bg-orange-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-700 transition-all">
                    <Download size={18} /> Télécharger PDF
                </button>
                <button className="flex-1 py-4 bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all">
                    <Printer size={18} /> Imprimer
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenRequests;