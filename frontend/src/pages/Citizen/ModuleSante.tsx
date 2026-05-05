import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Activity, PhoneCall, Stethoscope, Pill, HeartPulse, 
  MapPin, AlertTriangle, ShieldCheck, Thermometer, Droplet, User, Users
} from "lucide-react";
import toast from "react-hot-toast";

const ModuleSante: React.FC = () => {
  const { action } = useParams(); // 'samu', 'medecin', 'pharmacies', 'carnet'
  const navigate = useNavigate();

  // États globaux de personnalisation
  const [patient, setPatient] = useState<"moi" | "proche">("moi");
  const [nomProche, setNomProche] = useState("");

  // États pour le formulaire médecin
  const [symptomes, setSymptomes] = useState("");

  const nomAffiche = patient === "moi" ? "Brad Sergueï KOKOLIKO" : (nomProche || "votre proche");

  const handleDemandeMedecin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Demande envoyée pour ${nomAffiche} ! Le médecin de garde le plus proche vous contactera.`);
    navigate("/me");
  };

  // =========================================
  // VUE 1 : URGENCE SAMU (ROUGE / IMMÉDIAT)
  // =========================================
  if (action === "samu") {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-red-500/10 border border-red-500/30 rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-500/20 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse">
              <PhoneCall size={40} />
            </div>
            
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Urgence SAMU</h1>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-xl mb-8 border border-red-500/20">
              <MapPin size={16} />
              <span className="text-sm font-bold">Position GPS acquise : Abidjan, Côte d'Ivoire</span>
            </div>

            {/* Choix du patient en urgence */}
            <div className="bg-red-950/30 border border-red-500/20 rounded-2xl p-4 mb-8 text-left">
              <h3 className="text-red-300 text-[10px] font-black uppercase tracking-widest mb-3">Pour qui appelez-vous ?</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPatient("moi")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${patient === "moi" ? "bg-red-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                >
                  Moi-même
                </button>
                <button 
                  onClick={() => setPatient("proche")}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${patient === "proche" ? "bg-red-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
                >
                  Quelqu'un d'autre
                </button>
              </div>
              
              {patient === "proche" && (
                <input 
                  type="text" 
                  placeholder="Nom de la victime (si connu)..." 
                  value={nomProche}
                  onChange={(e) => setNomProche(e.target.value)}
                  className="w-full mt-3 bg-black/20 border border-red-500/20 rounded-xl p-3 text-sm text-white focus:border-red-500 outline-none placeholder:text-red-900"
                />
              )}
            </div>

            <p className="text-slate-300 text-sm mb-10 leading-relaxed">
              En déclenchant cet appel, les coordonnées GPS exactes et l'identité signalée seront transmises automatiquement au standard des urgences (185).
            </p>

            <a href="tel:185" className="block w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              Déclencher l'appel (185)
            </a>
            
            <button onClick={() => navigate(-1)} className="mt-6 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-wider">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // VUE 2 : MON CARNET VITAL (Reste personnel)
  // =========================================
  if (action === "carnet") {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">Carnet Vital</h1>
            <p className="text-slate-400 text-sm">Vos données médicales d'urgence sécurisées (Brad Sergueï KOKOLIKO).</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-rose-500/20 to-[#020617] border border-rose-500/30 rounded-3xl p-6 text-center">
              <Droplet size={32} className="text-rose-500 mx-auto mb-2" />
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Groupe Sanguin</p>
              <h2 className="text-5xl font-black text-white">O<span className="text-rose-500">+</span></h2>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Poids</p>
                <p className="text-white font-bold text-lg">78 kg</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Taille</p>
                <p className="text-white font-bold text-lg">182 cm</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4 text-amber-500">
                <AlertTriangle size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Allergies Connues</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">Pénicilline</span>
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">Arachides</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <ShieldCheck size={18} />
                <h3 className="font-bold text-sm uppercase tracking-widest">Statut Vaccinal</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-300 text-sm">Fièvre Jaune</span>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">À jour (2025)</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-300 text-sm">Tétanos</span>
                  <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">À jour (2023)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // VUE 3 : PHARMACIES DE GARDE
  // =========================================
  if (action === "pharmacies") {
    const pharmacies = [
      { nom: "Pharmacie Perle", lieu: "Abidjan, Cocody 2 Plateaux", distance: "0.8 km", status: "Ouvert" },
      { nom: "Pharmacie Saint-Viateur", lieu: "Abidjan, Palmeraie", distance: "2.1 km", status: "Ouvert" },
      { nom: "Pharmacie de la Providence", lieu: "Abidjan, Plateau", distance: "4.5 km", status: "Ferme bientôt" }
    ];

    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <Pill className="text-emerald-500" /> Pharmacies de Garde
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Les officines ouvertes les plus proches de votre position actuelle.</p>
        </div>

        <div className="space-y-4">
          {pharmacies.map((pharma, i) => (
            <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{pharma.nom}</h3>
                  <p className="text-slate-500 text-xs mt-1">{pharma.lieu} • <span className="text-slate-400 font-bold">{pharma.distance}</span></p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                pharma.status === "Ouvert" ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
              }`}>
                {pharma.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // VUE 4 : SOS MÉDECIN (Par défaut)
  // =========================================
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-3">
          <Stethoscope className="text-orange-500" /> SOS Médecin
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Faites venir un médecin de garde directement à votre domicile.</p>
      </div>

      <form onSubmit={handleDemandeMedecin} className="space-y-6">
        <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
          
          {/* Choix du patient */}
          <div>
            <label className="text-slate-400 text-xs block mb-3 uppercase tracking-widest font-bold">Pour qui effectuez-vous la demande ?</label>
            <div className="flex gap-4">
              <div 
                onClick={() => { setPatient("moi"); setNomProche(""); }}
                className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${patient === "moi" ? "bg-orange-500/10 border-orange-500" : "bg-slate-950 border-white/5"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${patient === "moi" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <User size={14} />
                </div>
                <span className="text-white font-bold text-sm">Moi-même</span>
              </div>
              <div 
                onClick={() => setPatient("proche")}
                className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${patient === "proche" ? "bg-orange-500/10 border-orange-500" : "bg-slate-950 border-white/5"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${patient === "proche" ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                  <Users size={14} />
                </div>
                <span className="text-white font-bold text-sm">Un proche</span>
              </div>
            </div>
            
            {patient === "proche" && (
              <input 
                type="text" 
                required
                value={nomProche}
                onChange={(e) => setNomProche(e.target.value)}
                placeholder="Nom complet du patient" 
                className="w-full mt-3 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-orange-500 outline-none transition-colors"
              />
            )}
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Adresse d'intervention</label>
            <div className="flex items-center gap-3 p-4 bg-[#020617] border border-white/5 rounded-xl">
              <MapPin className="text-orange-500" size={18} />
              <input type="text" defaultValue="Abidjan, Plateau Dokui" className="bg-transparent border-none outline-none text-white text-sm w-full" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-2 uppercase tracking-widest font-bold">Symptômes de {nomAffiche}</label>
            <div className="relative">
              <Thermometer className="absolute left-4 top-4 text-slate-500" size={18} />
              <textarea 
                required 
                value={symptomes}
                onChange={(e) => setSymptomes(e.target.value)}
                placeholder="Décrivez brièvement les symptômes (fièvre, douleurs...)" 
                className="w-full bg-[#020617] border border-white/5 rounded-xl p-4 pl-12 text-sm text-white focus:border-orange-500 outline-none min-h-[120px] resize-none transition-colors"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,130,0,0.3)]">
          Confirmer l'intervention pour {nomAffiche}
        </button>
      </form>
    </div>
  );
};

export default ModuleSante;