import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Scale, ShieldCheck, FileBadge, UploadCloud, Shield, Truck, CheckCircle2, User, Users, Receipt } from "lucide-react";
import toast from "react-hot-toast";

const FormulaireJuridique: React.FC = () => {
  const { type } = useParams(); // 'casier', 'nationalite', 'legalisation'
  const navigate = useNavigate();
  
  // États de l'application
  const [beneficiaire, setBeneficiaire] = useState<"moi" | "proche">("moi");
  const [modeReception, setModeReception] = useState<"numerique" | "physique">("numerique");
  
  // États pour la saisie en temps réel
  const [nomProche, setNomProche] = useState("");
  const [lienParente, setLienParente] = useState("");

  // Configuration dynamique
  const config = {
    casier: { titre: "Casier Judiciaire", fraisTimbre: 500, icon: <Scale className="text-orange-500" size={28} /> },
    nationalite: { titre: "Certificat de Nationalité", fraisTimbre: 1500, icon: <ShieldCheck className="text-orange-500" size={28} /> },
    legalisation: { titre: "Légalisation", fraisTimbre: 500, icon: <FileBadge className="text-orange-500" size={28} /> }
  };

  const currentConfig = config[type as keyof typeof config] || config.casier;

  // Calculs en temps réel
  const fraisLivraison = modeReception === "physique" ? 2000 : 0;
  const totalFrais = currentConfig.fraisTimbre + fraisLivraison;
  
  // Nom dynamique pour l'affichage
  const nomAffiche = beneficiaire === "moi" ? "Brad Sergueï" : (nomProche || "votre proche");
  const lienAffiche = beneficiaire === "proche" && lienParente ? ` (${lienParente})` : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Demande validée pour ${nomAffiche} ! Facture : ${totalFrais} FCFA`);
    navigate("/mes-demandes/suivi-livraison");
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          {currentConfig.icon} 
          Demande : {currentConfig.titre}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Démarche sécurisée pour <span className="text-orange-400 font-bold">{nomAffiche}</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* =========================================
            SECTION 1 : CHOIX DU BÉNÉFICIAIRE
            ========================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Pour qui effectuez-vous cette demande ?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => { setBeneficiaire("moi"); setNomProche(""); setLienParente(""); }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${beneficiaire === "moi" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${beneficiaire === "moi" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                <User size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Pour moi-même</h4>
                <p className="text-slate-500 text-xs">Utiliser mon profil existant</p>
              </div>
              {beneficiaire === "moi" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>

            <div 
              onClick={() => setBeneficiaire("proche")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${beneficiaire === "proche" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${beneficiaire === "proche" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                <Users size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Pour un proche</h4>
                <p className="text-slate-500 text-xs">Enfant, conjoint, parent...</p>
              </div>
              {beneficiaire === "proche" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>
          </div>

          {/* AFFICHAGE CONDITIONNEL : Données du demandeur */}
          {beneficiaire === "moi" ? (
            <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Identité Vérifiée</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-slate-500 block text-xs">Nom complet</span><span className="text-white font-medium">B. Sergueï Kokoliko</span></div>
                <div><span className="text-slate-500 block text-xs">NNI</span><span className="text-white font-medium">CI-8374-9920</span></div>
                <div><span className="text-slate-500 block text-xs">Lieu</span><span className="text-white font-medium">Abidjan</span></div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-900 border border-orange-500/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-orange-400 uppercase mb-2">Identité du proche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Lien de parenté</label>
                  <select 
                    required 
                    onChange={(e) => setLienParente(e.target.options[e.target.selectedIndex].text)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="enfant">Mon enfant</option>
                    <option value="conjoint">Mon / Ma conjoint(e)</option>
                    <option value="parent">Mon parent</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Numéro National (NNI)</label>
                  <input type="text" required placeholder="Ex: CI-XXXX-XXXX" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 text-xs block mb-1">Nom complet du proche</label>
                  <input 
                    type="text" 
                    required 
                    value={nomProche}
                    onChange={(e) => setNomProche(e.target.value)}
                    placeholder="Nom et prénoms" 
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Légalisation (Upload) */}
        {type === "legalisation" && (
          <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center text-center transition-all hover:border-orange-500/50">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <UploadCloud size={24} />
            </div>
            <h4 className="text-white font-bold text-sm">Importer le document</h4>
            <p className="text-slate-500 text-xs mt-1 mb-4">Format PDF ou JPG (Max 5Mo)</p>
            <button type="button" className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg border border-white/10 hover:border-orange-500/50">
              Parcourir
            </button>
          </div>
        )}

        {/* =========================================
            SECTION 2 : MODE DE RÉCEPTION
            ========================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Mode de réception</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setModeReception("numerique")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeReception === "numerique" ? "bg-emerald-500/10 border-emerald-500" : "bg-slate-900 border-white/5 hover:border-emerald-500/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <ShieldCheck size={24} className={modeReception === "numerique" ? "text-emerald-500" : "text-slate-500"} />
                {modeReception === "numerique" && <CheckCircle2 size={18} className="text-emerald-500" />}
              </div>
              <h4 className="text-white font-bold text-sm">Coffre-Fort Numérique</h4>
              <p className="text-slate-500 text-xs mt-1">Envoi immédiat sans frais de port (0 FCFA).</p>
            </div>

            <div 
              onClick={() => setModeReception("physique")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeReception === "physique" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <Truck size={24} className={modeReception === "physique" ? "text-orange-500" : "text-slate-500"} />
                {modeReception === "physique" && <CheckCircle2 size={18} className="text-orange-500" />}
              </div>
              <h4 className="text-white font-bold text-sm">Livraison Physique</h4>
              <p className="text-slate-500 text-xs mt-1">Expédition à domicile par coursier (+2000 FCFA).</p>
            </div>

          </div>
        </div>

        {/* =========================================
            RÉCAPITULATIF EN TEMPS RÉEL & PAIEMENT
            ========================================= */}
        <div className="bg-[#020617] border border-white/10 rounded-2xl p-5 mt-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
            <Receipt className="text-orange-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Récapitulatif de votre commande</h3>
          </div>
          
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between text-slate-300">
              <span>{currentConfig.titre} pour <strong className="text-white">{nomAffiche}{lienAffiche}</strong></span>
              <span>{currentConfig.fraisTimbre} FCFA</span>
            </div>
            {modeReception === "physique" && (
              <div className="flex justify-between text-slate-400">
                <span>Frais de livraison à domicile</span>
                <span>2000 FCFA</span>
              </div>
            )}
            <div className="flex justify-between text-white font-black text-lg pt-3 border-t border-white/10">
              <span>TOTAL À PAYER</span>
              <span className="text-orange-500">{totalFrais} FCFA</span>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,130,0,0.3)]">
            Payer {totalFrais} FCFA via Mobile Money
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormulaireJuridique;