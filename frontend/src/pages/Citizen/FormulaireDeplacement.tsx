import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Plane, BookUser, Map, CarFront, Shield, Truck, 
  CheckCircle2, Calendar, MapPin, UploadCloud, Receipt, User, Users 
} from "lucide-react";
import toast from "react-hot-toast";

const FormulaireDeplacement: React.FC = () => {
  const { type } = useParams(); // 'passeport', 'laisser-passer', 'declaration-trajet', 'permis'
  const navigate = useNavigate();

  // États de personnalisation en temps réel
  const [beneficiaire, setBeneficiaire] = useState<"moi" | "proche">("moi");
  const [nomProche, setNomProche] = useState("");
  const [lienParente, setLienParente] = useState("");

  // États globaux
  const [modeReception, setModeReception] = useState<"retrait" | "livraison">("retrait");
  
  // États spécifiques Déplacement
  const [villeDepart, setVilleDepart] = useState("Abidjan");
  const [villeArrivee, setVilleArrivee] = useState("");

  // Configuration dynamique selon la démarche
  const config = {
    passeport: { titre: "Demande de Passeport Biométrique", frais: 40000, icon: <BookUser className="text-orange-500" size={28} /> },
    "laisser-passer": { titre: "Sauf-Conduit / Laisser-Passer", frais: 10000, icon: <Plane className="text-orange-500" size={28} /> },
    "declaration-trajet": { titre: "Carnet de Route (Sécurité)", frais: 0, icon: <Map className="text-orange-500" size={28} /> },
    permis: { titre: "Enregistrement Permis / VTC", frais: 0, icon: <CarFront className="text-orange-500" size={28} /> }
  };

  const currentConfig = config[type as keyof typeof config] || config.passeport;

  // Calcul dynamique et temps réel
  const fraisLivraison = (modeReception === "livraison" && currentConfig.frais > 0) ? 2000 : 0;
  const totalFrais = currentConfig.frais + fraisLivraison;

  const nomAffiche = beneficiaire === "moi" ? "Brad Sergueï KOKOLIKO" : (nomProche || "votre proche");
  const lienAffiche = beneficiaire === "proche" && lienParente ? ` (${lienParente})` : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalFrais > 0) {
      toast.success(`Demande validée pour ${nomAffiche} ! Facture : ${totalFrais} FCFA payée.`);
      navigate("/mes-demandes/suivi-livraison");
    } else {
      toast.success(`${currentConfig.titre} pour ${nomAffiche} enregistré avec succès !`);
      navigate("/me");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          {currentConfig.icon} 
          {currentConfig.titre}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          {type === "declaration-trajet" 
            ? <>Déclarez le déplacement inter-urbain de <span className="text-orange-400 font-bold">{nomAffiche}</span> pour faciliter l'assistance routière.</>
            : <>Liez ce document de mobilité à l'identité numérique de <span className="text-orange-400 font-bold">{nomAffiche}</span>.</>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* =========================================
            CHOIX DU BÉNÉFICIAIRE & IDENTITÉ
            ========================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Identité du {type === "permis" ? "conducteur" : "voyageur"}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => { setBeneficiaire("moi"); setNomProche(""); setLienParente(""); }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${beneficiaire === "moi" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${beneficiaire === "moi" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                <User size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Moi-même</h4>
                <p className="text-slate-500 text-xs">Utiliser mon profil</p>
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
                <h4 className="text-white font-bold text-sm">Un proche</h4>
                <p className="text-slate-500 text-xs">Enfant, conjoint...</p>
              </div>
              {beneficiaire === "proche" && <CheckCircle2 size={18} className="text-orange-500" />}
            </div>
          </div>

          {beneficiaire === "moi" ? (
            <div className="p-5 bg-slate-900 border border-white/5 rounded-2xl animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Identité Vérifiée</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-slate-500 block text-xs">Nom complet</span><span className="text-white font-medium">Brad Sergueï KOKOLIKO</span></div>
                <div><span className="text-slate-500 block text-xs">NNI</span><span className="text-white font-medium">CI-8374-9920</span></div>
                <div><span className="text-slate-500 block text-xs">Statut</span><span className="text-emerald-500 font-medium text-xs bg-emerald-500/10 px-2 py-1 rounded">Vérifié</span></div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-900 border border-orange-500/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-orange-400 uppercase mb-2">Informations du proche</h3>
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
                    <option value="employe">Mon employé (Chauffeur)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Numéro National (NNI)</label>
                  <input type="text" required placeholder="Ex: CI-XXXX-XXXX" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 text-xs block mb-1">Nom complet</label>
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

        {/* =========================================
            SCÉNARIO 1 : PASSEPORT & LAISSER-PASSER
            ========================================= */}
        {(type === "passeport" || type === "laisser-passer") && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Type de demande</label>
                <select required className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none">
                  <option value="creation">Première demande</option>
                  <option value="renouvellement">Renouvellement</option>
                  {type === "passeport" && <option value="perte">Perte / Vol</option>}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Prise de RDV (Enrôlement)</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="date" required className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 pl-10 text-sm text-white focus:border-orange-500 outline-none" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Mode de retrait du livret</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setModeReception("retrait")} className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeReception === "retrait" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <MapPin size={24} className={modeReception === "retrait" ? "text-orange-500" : "text-slate-500"} />
                    {modeReception === "retrait" && <CheckCircle2 size={18} className="text-orange-500" />}
                  </div>
                  <h4 className="text-white font-bold text-sm">Retrait en Agence (Snedai)</h4>
                </div>
                <div onClick={() => setModeReception("livraison")} className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeReception === "livraison" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <Truck size={24} className={modeReception === "livraison" ? "text-orange-500" : "text-slate-500"} />
                    {modeReception === "livraison" && <CheckCircle2 size={18} className="text-orange-500" />}
                  </div>
                  <h4 className="text-white font-bold text-sm">Livraison Sécurisée (+2000F)</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            SCÉNARIO 2 : ENREGISTRER UN DÉPLACEMENT
            ========================================= */}
        {type === "declaration-trajet" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Ville de Départ</label>
                <input type="text" value={villeDepart} onChange={(e) => setVilleDepart(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Ville d'Arrivée</label>
                <input type="text" required value={villeArrivee} onChange={(e) => setVilleArrivee(e.target.value)} placeholder="Ex: Yamoussoukro" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Date et Heure du départ</label>
                <input type="datetime-local" required className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Moyen de transport</label>
                <select required className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none">
                  <option value="personnel">Véhicule Personnel</option>
                  <option value="car">Compagnie de Transport (Car)</option>
                  <option value="covoiturage">Covoiturage</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            SCÉNARIO 3 : PERMIS DE CONDUIRE / VTC
            ========================================= */}
        {type === "permis" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Numéro du Permis de Conduire</label>
                <input type="text" required placeholder="Ex: PC-123456789" className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Catégories obtenues</label>
                <input type="text" required placeholder="Ex: BCDE" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1 uppercase tracking-widest font-bold">Profil d'usage</label>
                <select className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none">
                  <option value="prive">Usage Privé uniquement</option>
                  <option value="vtc">Chauffeur VTC / Transport Public</option>
                  <option value="lourd">Poids Lourd / Logistique</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl bg-slate-900/50 flex flex-col items-center text-center">
              <UploadCloud size={24} className="text-slate-400 mb-3" />
              <h4 className="text-white font-bold text-sm">Scanner le permis recto/verso</h4>
              <button type="button" className="mt-4 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg border border-white/10 hover:border-orange-500/50 transition-colors">Parcourir</button>
            </div>
          </div>
        )}

        {/* =========================================
            VALIDATION & PAIEMENT DYNAMIQUE
            ========================================= */}
        {currentConfig.frais > 0 ? (
          <div className="bg-[#020617] border border-white/10 rounded-2xl p-5 mt-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
              <Receipt className="text-orange-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Récapitulatif de la commande</h3>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-slate-300">
                <span>Frais de dossier pour <strong className="text-white">{nomAffiche}{lienAffiche}</strong></span>
                <span>{currentConfig.frais} FCFA</span>
              </div>
              {modeReception === "livraison" && (
                <div className="flex justify-between text-slate-400">
                  <span>Livraison sécurisée à domicile</span>
                  <span>2000 FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-lg pt-3 border-t border-white/10">
                <span>TOTAL À PAYER</span>
                <span className="text-orange-500">{totalFrais} FCFA</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98]">
              Payer {totalFrais} FCFA via Mobile Money
            </button>
          </div>
        ) : (
          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-8">
            Enregistrer pour {nomAffiche} (Gratuit)
          </button>
        )}

      </form>
    </div>
  );
};

export default FormulaireDeplacement;