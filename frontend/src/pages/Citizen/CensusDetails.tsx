import React, { useState } from "react";
import { 
  Users, Home, Zap, Save, UserCheck, 
  PlusCircle, Trash2, Info, Camera, 
  Image as ImageIcon, Fingerprint, Phone
} from "lucide-react";
import { toast } from "react-hot-toast";

// Structure de données pour un membre de la famille
interface FamilyMember {
  id: number;
  lastName: string;
  firstName: string;
  age: string;
  religion: string;
  profession: string;
  relation: string;
  nni: string; // Identité sociale/nationale
}

const CensusDetails = () => {
  // État pour gérer la liste dynamique des membres
  const [members, setMembers] = useState<FamilyMember[]>([
    { 
      id: Date.now(), 
      lastName: "", 
      firstName: "", 
      age: "", 
      religion: "Christianisme", 
      profession: "", 
      relation: "Conjoint(e)",
      nni: "" 
    }
  ]);

  // Fonction pour ajouter un nouveau bloc de membre
  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now(),
      lastName: "",
      firstName: "",
      age: "",
      religion: "Christianisme",
      profession: "",
      relation: "Enfant",
      nni: ""
    };
    setMembers([...members, newMember]);
    toast.success("Nouveau membre ajouté à la fiche");
  };

  // Fonction pour supprimer un membre
  const removeMember = (id: number) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    } else {
      toast.error("Le déclarant (Chef de ménage) ne peut pas être supprimé.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER : TITRE RÉGALIEN */}
      <div className="flex flex-col gap-2 border-l-4 border-orange-500 pl-6 mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Recensement National</h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Fiche Individuelle & Caractéristiques du Ménage</p>
      </div>

      <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
        
        {/* ============================================================ */}
        {/* 1. PHOTO & IDENTITÉ DU CHEF DE MÉNAGE                        */}
        {/* ============================================================ */}
        <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-6">
            <div className="flex items-center gap-3 text-orange-600">
              <UserCheck size={28} />
              <h3 className="text-sm font-black uppercase tracking-widest">Identité du Chef de Ménage</h3>
            </div>
            <span className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-full tracking-widest">
              Identifiant Social Unique
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Zone Photo Profil Chef */}
            <div className="relative group shrink-0 mx-auto lg:mx-0">
              <div className="w-40 h-40 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 group-hover:border-orange-500 group-hover:bg-orange-50/30 transition-all overflow-hidden relative shadow-inner">
                <Camera size={40} strokeWidth={1.5} />
                <span className="text-[9px] font-black uppercase mt-3 tracking-tighter text-center px-4">Photo officielle</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-white">
                <PlusCircle size={18} />
              </div>
            </div>

            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Nom de famille" placeholder="KOUAME" />
                <InputGroup label="Prénoms" placeholder="Jean Marc" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputGroup label="NNI / Identité Sociale" placeholder="CI-0102938475" />
                <InputGroup label="Numéro de Téléphone" type="tel" placeholder="07 00 00 00 00" />
                <InputGroup label="Âge" type="number" placeholder="Ans" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Religion / Confession" type="select" options={["Christianisme", "Islam", "Animisme", "Bouddhisme", "Autre"]} />
                <InputGroup label="Profession Actuelle" placeholder="Ex: Architecte, Commerçant..." />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. CADRE DE VIE (LOGEMENT & SERVICES)                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-slate-800">
              <Home size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest">Caractéristiques de l'Habitat</h3>
            </div>
            <div className="space-y-4">
              <InputGroup label="Type de construction" type="select" options={["Maison en dur", "Appartement", "Studio moderne", "Habitat traditionnel"]} />
              <InputGroup label="Nombre de pièces" type="number" placeholder="Ex: 4" />
              <InputGroup label="Statut d'occupation" type="select" options={["Propriétaire", "Locataire", "Logé par l'employeur"]} />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <Zap size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest">Accès aux Services</h3>
            </div>
            <div className="space-y-4">
              <InputGroup label="Source d'énergie" type="select" options={["CIE", "Solaire", "Autre"]} />
              <InputGroup label="Source d'eau" type="select" options={["SODECI", "Forage privé", "Pompe"]} />
              <InputGroup label="Déchets" type="select" options={["Ramassage public", "Incinération"]} />
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* 3. COMPOSITION DU MÉNAGE (DYNAMIQUE AVEC PHOTOS & NNI)      */}
        {/* ============================================================ */}
        <section className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-white">
            <Users size={200} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-2xl">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Membres rattachés au foyer</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Identification visuelle et sociale</p>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={addMember}
              className="px-8 py-4 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-500 hover:text-white transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <PlusCircle size={18} /> Ajouter une personne
            </button>
          </div>

          <div className="space-y-6 relative z-10 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {members.map((member, index) => (
              <div 
                key={member.id} 
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5 items-center transition-all hover:bg-white/10"
              >
                {/* Photo de profil du membre */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative w-16 h-16 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center text-white/30 hover:border-orange-500 transition-all cursor-pointer">
                    <ImageIcon size={24} />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  </div>
                  <span className="text-[8px] font-black text-slate-500 mt-2">PHOTO</span>
                </div>

                <div className="md:col-span-3 space-y-3">
                  <InputGroupDark label="Nom" placeholder="NOM" />
                  <InputGroupDark label="Prénoms" placeholder="PRÉNOMS" />
                </div>

                <div className="md:col-span-3 space-y-3">
                  <InputGroupDark label="Identité Sociale (NNI)" placeholder="CI-XXXXXXXX" />
                  <InputGroupDark label="Lien" type="select" options={["Conjoint(e)", "Enfant", "Parent", "Autre"]} />
                </div>

                <div className="md:col-span-3 space-y-3">
                  <InputGroupDark label="Profession" placeholder="Activité" />
                  <div className="grid grid-cols-2 gap-2">
                    <InputGroupDark label="Âge" type="number" placeholder="Ans" />
                    <InputGroupDark label="Religion" type="select" options={["Christianisme", "Islam", "Autre"]} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button 
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all border border-red-500/20 shadow-lg"
                  >
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOUTON DE VALIDATION FINALE */}
        <button className="w-full py-8 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-3xl shadow-2xl transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-4 group active:scale-95">
          <Save size={20} className="group-hover:scale-110 transition-transform" />
          <span>Finaliser le recensement biométrique du ménage</span>
        </button>

      </form>
    </div>
  );
};

// --- HELPERS UI ---

const InputGroup = ({ label, type = "text", options, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    {type === "select" ? (
      <select className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} placeholder={placeholder} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-slate-700" />
    )}
  </div>
);

const InputGroupDark = ({ label, type = "text", options, placeholder }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">{label}</label>
    {type === "select" ? (
      <select className="w-full p-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-orange-500 text-white font-bold text-xs appearance-none cursor-pointer">
        {options.map((o: string) => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
      </select>
    ) : (
      <input type={type} placeholder={placeholder} className="w-full p-3 bg-white/5 rounded-xl border border-white/10 outline-none focus:border-orange-500 text-white font-bold text-xs" />
    )}
  </div>
);

export default CensusDetails;