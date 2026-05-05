import React from "react";
import { QrCode, ShieldCheck, Download, FileText } from "lucide-react";

const CoffreFort: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" /> Mon Coffre-Fort
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Vos documents officiels certifiés, prêts à être scannés par l'administration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Le QR Code Dynamique */}
        <div className="md:col-span-1 bg-gradient-to-b from-slate-900 to-[#020617] border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center text-center">
          <div className="w-full aspect-square bg-white rounded-2xl p-4 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            {/* Remplacer par un vrai composant QRCode plus tard */}
            <QrCode size={150} className="text-slate-900" />
          </div>
          <h3 className="text-emerald-400 font-black tracking-widest uppercase text-sm mb-1">Pass Citoyen</h3>
          <p className="text-slate-500 text-[10px] uppercase tracking-wider">Scannez pour vérifier l'authenticité</p>
        </div>

        {/* Liste des documents */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Documents Disponibles</h3>
          
          {[
            { nom: "Extrait de Naissance", id: "EXT-2026-001", date: "24 Fév 2026" },
            { nom: "Certificat de Nationalité", id: "NAT-2025-890", date: "12 Déc 2025" }
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{doc.nom}</h4>
                  <p className="text-slate-500 text-xs">Réf: {doc.id} • Généré le {doc.date}</p>
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-emerald-500/10 rounded-xl transition-all">
                <Download size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoffreFort;