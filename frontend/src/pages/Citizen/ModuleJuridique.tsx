import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShieldAlert, Gavel, Scale, AlertTriangle, MessageSquareWarning, 
  MapPin, Camera, Search, Calendar, Clock, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";

const ModuleJuridique: React.FC = () => {
  const { action } = useParams(); // 'signalement', 'avocats', 'mediation', 'consultation'
  const navigate = useNavigate();

  // États globaux
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre demande a été transmise aux services compétents.");
    navigate("/me");
  };

  // =========================================
  // VUE 1 : SIGNALEMENT (Discret & Urgent)
  // =========================================
  if (action === "signalement") {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-amber-500 uppercase tracking-wider flex items-center gap-3">
              <AlertTriangle size={28} /> Signalement Confidentiel
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Alertez les autorités discrètement. Ce formulaire est chiffré de bout en bout.</p>
          </div>
          <button onClick={() => navigate("/me")} className="text-slate-500 hover:text-white bg-slate-900 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            Quitter rapidement
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 border border-amber-500/20 rounded-[2rem] p-6 md:p-8">
          
          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Nature de l'incident</label>
            <select required className="w-full bg-[#020617] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none">
              <option value="">Sélectionnez le type...</option>
              <option value="vbg">Violences Basées sur le Genre (VBG)</option>
              <option value="harcelement">Harcèlement ou Menaces</option>
              <option value="corruption">Corruption / Extorsion</option>
              <option value="enfant">Violence sur mineur</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Lieu (ou position actuelle)</label>
            <div className="flex items-center gap-3 p-4 bg-[#020617] border border-white/5 rounded-xl focus-within:border-amber-500 transition-colors">
              <MapPin className="text-amber-500" size={18} />
              <input type="text" placeholder="Adresse exacte ou quartier..." required className="bg-transparent border-none outline-none text-white text-sm w-full" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Description des faits</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce qui se passe ou s'est passé..." 
              className="w-full bg-[#020617] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-amber-500 outline-none min-h-[120px] resize-none"
            />
          </div>

          {/* Preuves (Optionnel) */}
          <div className="p-4 border border-dashed border-white/10 rounded-xl bg-[#020617] flex items-center justify-between group hover:border-amber-500/50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-amber-500">
                <Camera size={18} />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Ajouter une preuve (Optionnel)</p>
                <p className="text-slate-500 text-xs">Photo, vidéo ou document audio</p>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98]">
            Transmettre l'alerte à la Police
          </button>
        </form>
      </div>
    );
  }

  // =========================================
  // VUE 2 : ANNUAIRE DES AVOCATS
  // =========================================
  if (action === "avocats") {
    const avocatsList = [
      { nom: "Maître Kacou Jean", spe: "Droit des Affaires & Foncier", dispo: "Disponible", tel: "+225 07 XX XX XX XX" },
      { nom: "Maître Bamba Affoué", spe: "Droit de la Famille", dispo: "Sur Rendez-vous", tel: "+225 05 XX XX XX XX" },
      { nom: "Cabinet Juris-CI", spe: "Droit Pénal", dispo: "Urgence 24/7", tel: "+225 01 XX XX XX XX" },
    ];

    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <Scale className="text-orange-500" /> Ordre des Avocats
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Trouvez un avocat certifié correspondant à votre besoin juridique.</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex items-center gap-3 p-4 bg-slate-900 border border-white/5 rounded-xl focus-within:border-orange-500 transition-colors">
            <Search className="text-slate-500" size={18} />
            <input type="text" placeholder="Rechercher par nom ou spécialité..." className="bg-transparent border-none outline-none text-white text-sm w-full" />
          </div>
          <select className="bg-slate-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none md:w-64">
            <option>Toutes les spécialités</option>
            <option>Droit de la Famille</option>
            <option>Droit Foncier</option>
            <option>Droit des Affaires</option>
            <option>Droit Pénal</option>
          </select>
        </div>

        {/* Liste des résultats */}
        <div className="space-y-4">
          {avocatsList.map((avocat, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800 text-orange-500 rounded-2xl flex items-center justify-center border border-white/5">
                  <Scale size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-bold text-base">{avocat.nom}</h3>
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                      <CheckCircle2 size={10} /> Certifié
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{avocat.spe}</p>
                  <p className="text-slate-500 text-xs mt-2 font-mono">{avocat.tel}</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                Contacter
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // VUE 3 & 4 : MÉDIATION ET CONSULTATION (Formulaire RDV)
  // =========================================
  const isMediation = action === "mediation";
  
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          {isMediation ? <MessageSquareWarning className="text-orange-500" /> : <Gavel className="text-orange-500" />}
          {isMediation ? "Médiation de Proximité" : "Consultation Juridique"}
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          {isMediation 
            ? "Prenez rendez-vous avec un médiateur pour régler un litige à l'amiable." 
            : "Planifiez une consultation avec un conseiller juridique pour connaître vos droits."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
          
          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Sujet principal</label>
            <select required className="w-full bg-[#020617] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none">
              {isMediation ? (
                <>
                  <option value="">Sélectionnez la nature du litige...</option>
                  <option value="voisinage">Conflit de voisinage</option>
                  <option value="locatif">Bailleur / Locataire</option>
                  <option value="commercial">Litige commercial</option>
                </>
              ) : (
                <>
                  <option value="">Sélectionnez le domaine...</option>
                  <option value="famille">Droit de la famille (Divorce, Garde...)</option>
                  <option value="travail">Droit du travail (Licenciement, Contrat...)</option>
                  <option value="foncier">Affaires foncières (Terrain, Propriété...)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Description de la situation</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Expliquez brièvement votre situation..." 
              className="w-full bg-[#020617] border border-white/5 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Date souhaitée</label>
              <div className="flex items-center gap-3 p-3 bg-[#020617] border border-white/5 rounded-xl focus-within:border-orange-500">
                <Calendar className="text-slate-500" size={18} />
                <input type="date" required className="bg-transparent border-none outline-none text-white text-sm w-full" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Créneau horaire</label>
              <div className="flex items-center gap-3 p-3 bg-[#020617] border border-white/5 rounded-xl focus-within:border-orange-500">
                <Clock className="text-slate-500" size={18} />
                <select required className="bg-transparent border-none outline-none text-white text-sm w-full">
                  <option value="matin">Matin (08h - 12h)</option>
                  <option value="apres-midi">Après-midi (14h - 17h)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,130,0,0.3)]">
          Confirmer la demande de rendez-vous
        </button>
      </form>
    </div>
  );
};

export default ModuleJuridique;