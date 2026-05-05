import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileSignature, MapPin, Truck, CheckCircle2, User, Users } from "lucide-react";
import toast from "react-hot-toast";

const FormulaireActe: React.FC = () => {
  const { type } = useParams(); // recupère 'naissance', 'integrale', etc.
  const navigate = useNavigate();
  
  // Nouveaux états pour gérer le bénéficiaire
  const [beneficiaire, setBeneficiaire] = useState<"moi" | "proche">("moi");
  const [modeRetrait, setModeRetrait] = useState<"mairie" | "livraison">("mairie");

  // Formatage du titre en fonction de l'URL
  const titreActe = type?.replace("-", " ").toUpperCase() || "DOCUMENT";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cible = beneficiaire === "moi" ? "vous-même" : "votre proche";
    toast.success(`Demande de ${titreActe} pour ${cible} envoyée avec succès !`);
    navigate("/mes-demandes/suivi-livraison");
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <FileSignature className="text-orange-500" /> Demande : {titreActe}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Renseignez les détails pour l'obtention de votre document d'état civil.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* =========================================
            SECTION 1 : CHOIX DU BÉNÉFICIAIRE
            ========================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Pour qui effectuez-vous cette demande ?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Option : Pour moi-même */}
            <div 
              onClick={() => setBeneficiaire("moi")}
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

            {/* Option : Pour un proche */}
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
              <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Vos informations pré-remplies</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500 block text-xs">Nom complet</span><span className="text-white font-medium">B. Sergueï K.</span></div>
                <div><span className="text-slate-500 block text-xs">NNI</span><span className="text-white font-medium">CI-8374-9920</span></div>
                <div><span className="text-slate-500 block text-xs">Mairie de naissance</span><span className="text-white font-medium">Korhogo</span></div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-slate-900 border border-orange-500/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-bold text-orange-400 uppercase mb-2">Informations du proche</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Lien de parenté</label>
                  <select required className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors">
                    <option value="">Sélectionner...</option>
                    <option value="enfant">Mon enfant</option>
                    <option value="conjoint">Mon / Ma conjoint(e)</option>
                    <option value="parent">Mon parent</option>
                    <option value="autre">Autre (Tuteur légal)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Numéro National (NNI)</label>
                  <input type="text" required placeholder="Ex: CI-XXXX-XXXX" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 text-xs block mb-1">Nom complet du proche</label>
                  <input type="text" required placeholder="Nom et prénoms tels qu'inscrits à l'état civil" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-slate-400 text-xs block mb-1">Mairie de naissance du proche</label>
                  <input type="text" required placeholder="Ex: Mairie de Bouaké" className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================
            SECTION 2 : MODE DE RETRAIT
            ========================================= */}
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase mb-4">Mode d'obtention</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div 
              onClick={() => setModeRetrait("mairie")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeRetrait === "mairie" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <MapPin size={24} className={modeRetrait === "mairie" ? "text-orange-500" : "text-slate-500"} />
                {modeRetrait === "mairie" && <CheckCircle2 size={18} className="text-orange-500" />}
              </div>
              <h4 className="text-white font-bold text-sm">Retrait en Mairie</h4>
              <p className="text-slate-500 text-xs mt-1">L'acte sera transféré vers la mairie de votre choix grâce à l'interconnexion.</p>
              
              {modeRetrait === "mairie" && (
                <div className="mt-4 animate-in fade-in duration-300">
                  <label className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Choisir la mairie de retrait :</label>
                  <select className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none">
                    <option>Mairie de Cocody (Abidjan)</option>
                    <option>Mairie de Yopougon (Abidjan)</option>
                    <option>Mairie du Plateau (Abidjan)</option>
                    <option>Mairie de Bouaké</option>
                  </select>
                </div>
              )}
            </div>

            <div 
              onClick={() => setModeRetrait("livraison")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${modeRetrait === "livraison" ? "bg-orange-500/10 border-orange-500" : "bg-slate-900 border-white/5 hover:border-orange-500/30"}`}
            >
              <div className="flex justify-between items-start mb-2">
                <Truck size={24} className={modeRetrait === "livraison" ? "text-orange-500" : "text-slate-500"} />
                {modeRetrait === "livraison" && <CheckCircle2 size={18} className="text-orange-500" />}
              </div>
              <h4 className="text-white font-bold text-sm">Livraison Sécurisée</h4>
              <p className="text-slate-500 text-xs mt-1">Recevez le document physique directement chez vous via coursier (+2000 FCFA).</p>
            </div>

          </div>
        </div>

        {/* =========================================
            BOUTON DE SOUMISSION
            ========================================= */}
        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,130,0,0.3)]">
          Valider la demande
        </button>
      </form>
    </div>
  );
};

export default FormulaireActe;