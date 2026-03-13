import React, { useState } from "react";
import { 
  Baby, Save, Fingerprint, Heart, User, 
  Camera, Upload, Phone, Briefcase, Info, X
} from "lucide-react";
import { toast } from "react-hot-toast";

const BirthDeclaration: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Dossier Parent-Enfant synchronisé !", {
        icon: '🧬',
        style: { borderRadius: '20px', background: '#0f172a', color: '#fff' }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-1000 pb-20">
      
      {/* HEADER */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Fingerprint size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
            <Baby size={48} className="text-emerald-400" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Registre de Filiation</h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Identité Numérique Certifiée • RecensCI</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* --- SECTION 01 : L'ENFANT --- */}
        <section className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
          <SectionTitle icon={<Baby size={20}/>} title="Identité du Nouveau-Né" color="text-emerald-600" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <PhotoUpload label="Photo Enfant" color="emerald" />
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Nom" placeholder="KOUAME" required />
              <InputGroup label="Prénoms" placeholder="Marc-Aurèle" required />
              <InputGroup label="Sexe" type="select" options={["Masculin", "Féminin"]} />
              <InputGroup label="Date de Naissance" type="date" required />
            </div>
          </div>
        </section>

        {/* --- SECTION 02 : LES PARENTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* CARTE PÈRE */}
          <ParentCard 
            role="Le Père" 
            icon={<User size={20}/>} 
            color="blue"
            defaultName="Kevin Gael Kouhame"
          />

          {/* CARTE MÈRE */}
          <ParentCard 
            role="La Mère" 
            icon={<Heart size={20}/>} 
            color="pink"
            defaultName="Traoré Aminata"
          />

        </div>

        {/* BOUTON DE SOUMISSION */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 bg-blue-50 p-6 rounded-[2rem] border border-blue-100 max-w-2xl">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] text-blue-800 font-bold leading-relaxed italic">
              En cliquant sur valider, vous certifiez l'exactitude des informations parentales. 
              Les photos seront analysées par le service de biométrie pour l'édition de la carte NNI.
            </p>
          </div>
          
          <button 
            disabled={loading}
            className="w-full max-w-md py-8 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-[2.5rem] shadow-2xl transition-all duration-500 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 group"
          >
            {loading ? "Traitement Biométrique..." : <><Save size={20} className="group-hover:scale-125 transition-transform" /> Valider l'enregistrement</>}
          </button>
        </div>

      </form>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const SectionTitle = ({ icon, title, color }: any) => (
  <div className={`flex items-center gap-3 border-b border-slate-50 pb-6 ${color}`}>
    {icon}
    <h3 className="text-sm font-black uppercase tracking-widest italic">{title}</h3>
  </div>
);

const PhotoUpload = ({ label, color }: any) => (
  <div className="space-y-4">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</p>
    <div className={`relative group w-40 h-48 mx-auto bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden hover:border-${color}-500 transition-all cursor-pointer shadow-inner`}>
      <Camera size={32} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
      <span className="text-[8px] font-black text-slate-400 mt-2 uppercase">Capturer</span>
    </div>
  </div>
);

const ParentCard = ({ role, icon, color, defaultName }: any) => (
  <section className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-8">
    <div className={`flex items-center justify-between border-b border-slate-50 pb-4 text-${color}-600`}>
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="text-xs font-black uppercase tracking-widest italic">{role}</h3>
      </div>
      <Upload size={16} className="text-slate-300" />
    </div>

    <div className="flex flex-col sm:flex-row gap-6">
      <div className={`w-24 h-24 shrink-0 bg-${color}-50 rounded-2xl border-2 border-dashed border-${color}-100 flex items-center justify-center text-slate-300`}>
        <Camera size={24} />
      </div>
      <div className="flex-1 space-y-4">
        <InputGroup label="Nom & Prénoms" placeholder={defaultName} required />
        <InputGroup label="Profession" icon={<Briefcase size={12}/>} placeholder="Ex: Chef d'entreprise" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Téléphone" icon={<Phone size={12}/>} placeholder="+225 07..." />
          <InputGroup label="Numéro NNI" placeholder="CI-XXXXXXXX" />
        </div>
      </div>
    </div>
  </section>
);

const InputGroup = ({ label, type = "text", options, placeholder, required, icon }: any) => (
  <div className="space-y-1.5 group">
    <div className="flex items-center gap-2 ml-4">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-600 transition-colors">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <span className="text-slate-300">{icon}</span>
    </div>
    {type === "select" ? (
      <select className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-sm text-slate-700 appearance-none">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-sm text-slate-700" 
      />
    )}
  </div>
);

export default BirthDeclaration;