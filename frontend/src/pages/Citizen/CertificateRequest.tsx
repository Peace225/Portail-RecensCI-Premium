// Module 12 — Demande de certificats & documents
import React, { useState } from "react";
import { apiService } from "../../services/apiService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast } from "react-hot-toast";
import { FileText, Search, Send, Cpu, CheckCircle2, Clock } from "lucide-react";

const CERTIFICATE_TYPES = [
  { value: "EXTRAIT_NAISSANCE", label: "Extrait d'Acte de Naissance" },
  { value: "ACTE_MARIAGE", label: "Acte de Mariage" },
  { value: "ACTE_DECES", label: "Acte de Décès" },
  { value: "CERTIFICAT_RESIDENCE", label: "Certificat de Résidence" },
  { value: "CERTIFICAT_NATIONALITE", label: "Certificat de Nationalité" },
  { value: "CERTIFICAT_CELIBAT", label: "Certificat de Célibat" },
  { value: "CASIER_JUDICIAIRE", label: "Casier Judiciaire" },
];

const CertificateRequest: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [trackRef, setTrackRef] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: "EXTRAIT_NAISSANCE",
    purpose: "",
    citizenName: user.name || "",
    citizenNni: user.nni || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result: any = await apiService.post('/modules/certificates', formData);
      toast.success(`Demande enregistrée ! Référence : ${result.referenceNumber}`, { duration: 8000 });
    } catch {
      toast.error("Erreur lors de la demande.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!trackRef.trim()) return;
    try {
      const result = await apiService.get(`/modules/certificates/track/${trackRef}`);
      setTrackResult(result);
    } catch {
      toast.error("Référence introuvable.");
      setTrackResult(null);
    }
  };

  const statusColor: Record<string, string> = {
    EN_ATTENTE: "text-amber-500 bg-amber-500/10",
    EN_TRAITEMENT: "text-blue-400 bg-blue-500/10",
    PRET: "text-emerald-400 bg-emerald-500/10",
    DELIVRE: "text-emerald-500 bg-emerald-500/20",
    REJETE: "text-red-400 bg-red-500/10",
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-10">

        <div className="border-l-4 border-orange-500 pl-6">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Certificats & <span className="text-orange-500">Documents</span></h2>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-1">Demande de documents officiels en ligne</p>
        </div>

        {/* Suivi de demande */}
        <div className="bg-[#050914] border border-white/5 p-8 rounded-[2.5rem] space-y-4">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2"><Search size={16} /> Suivre une demande</h3>
          <div className="flex gap-3">
            <input value={trackRef} onChange={e => setTrackRef(e.target.value)}
              placeholder="CERT-1234567890-123"
              className="flex-1 p-4 bg-slate-800 rounded-2xl text-white text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-500" />
            <button onClick={handleTrack} className="px-6 py-4 bg-cyan-500 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all text-xs uppercase tracking-widest">
              Rechercher
            </button>
          </div>
          {trackResult && (
            <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase">{CERTIFICATE_TYPES.find(t => t.value === trackResult.type)?.label}</span>
                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${statusColor[trackResult.status] || 'text-slate-400'}`}>{trackResult.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Réf: {trackResult.referenceNumber}</p>
              <p className="text-[10px] text-slate-500">Demandé le : {new Date(trackResult.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
        </div>

        {/* Nouvelle demande */}
        <form onSubmit={handleSubmit} className="bg-[#050914] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><FileText size={16} /> Nouvelle demande</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Type de document</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500">
                {CERTIFICATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Motif de la demande</label>
              <input value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})}
                placeholder="Ex: Inscription scolaire, Emploi..."
                className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-600" />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom complet</label>
              <input value={formData.citizenName} onChange={e => setFormData({...formData, citizenName: e.target.value})}
                className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500" required />
            </div>
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">NNI</label>
              <input value={formData.citizenNni} onChange={e => setFormData({...formData, citizenNni: e.target.value})}
                placeholder="CI-XXXX-XXXX"
                className="w-full p-4 bg-slate-800 rounded-2xl text-white text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-600" />
            </div>
          </div>

          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-3">
            <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400">Délai de traitement : 3 à 5 jours ouvrables. Vous recevrez une notification dès que votre document est prêt.</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-xs shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <><Cpu size={18} className="animate-spin" /> Envoi...</> : <><Send size={18} /> Soumettre la demande</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateRequest;
