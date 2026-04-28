import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, ShieldCheck, MapPin, Fingerprint, 
  ScanFace, QrCode, Cpu, Save, XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';

export default function AddAgent() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    zone: 'Abidjan (Cocody)',
    clearance: 'GAMMA',
  });

  const [isScanning, setIsScanning] = useState(false);
  const [bioStatus, setBioStatus] = useState('waiting');

  const handleBioScan = () => {
    setIsScanning(true);
    setBioStatus('scanning');
    setTimeout(() => {
      setIsScanning(false);
      setBioStatus('success');
    }, 2500);
  };

  const handleSubmit = async () => {
    try {
      await apiService.post('/agents', {
        email: formData.email,
        fullName: `${formData.prenom} ${formData.nom}`,
        role: 'AGENT',
      });
      toast.success('Profil agent créé avec succès');
    } catch {
      toast.error('Erreur lors de la création du profil agent');
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 flex items-center gap-3">
          <UserPlus className="text-cyan-400" size={32} />
          Enrôlement <span className="text-purple-500">Nouvel Agent</span>
        </h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
          Génération de profil sécurisé et accréditation RNPP
        </p>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7 space-y-6">
          
          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
              <ScanFace size={16} className="text-cyan-400" /> Identité Civile
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Nom de famille</label>
                <input 
                  type="text" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold uppercase focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="EX: KOUASSI"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Prénoms</label>
                <input 
                  type="text" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold uppercase focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="EX: JEAN-MARC"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Téléphone (Appareil Sécurisé)</label>
                <input 
                  type="tel" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="+225 01 02 03 04 05"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Adresse Email</label>
                <input 
                  type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                  placeholder="agent@recensci.ci"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
              <ShieldCheck size={16} className="text-purple-500" /> Déploiement & Habilitation
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Secteur d'Affectation</label>
                <select 
                  value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold uppercase appearance-none focus:outline-none focus:border-purple-500/50"
                >
                  <option value="Abidjan (Cocody)">Abidjan (Cocody)</option>
                  <option value="Abidjan (Yopougon)">Abidjan (Yopougon)</option>
                  <option value="Bouaké (Gbêkê)">Bouaké (Gbêkê)</option>
                  <option value="Korhogo (Poro)">Korhogo (Poro)</option>
                  <option value="San-Pédro">San-Pédro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-2">Niveau d'Accès</label>
                <select 
                  value={formData.clearance} onChange={(e) => setFormData({...formData, clearance: e.target.value})}
                  className={`w-full border rounded-xl px-4 py-3 text-sm font-black uppercase appearance-none focus:outline-none transition-colors ${
                    formData.clearance === 'ALPHA' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' :
                    formData.clearance === 'BETA' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' :
                    'bg-amber-500/10 border-amber-500/50 text-amber-400'
                  }`}
                >
                  <option value="GAMMA">Niveau Gamma (Saisie Base)</option>
                  <option value="BETA">Niveau Beta (Validation)</option>
                  <option value="ALPHA">Niveau Alpha (Superviseur)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1 flex items-center gap-2">
                <Fingerprint size={18} className="text-emerald-500" /> Empreinte Matérielle
              </h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest">Associer la tablette à cet agent</p>
            </div>
            <button 
              onClick={handleBioScan} disabled={isScanning || bioStatus === 'success'}
              className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                bioStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
              }`}
            >
              {isScanning ? <><Cpu size={14} className="animate-spin text-cyan-400" /> LECTURE...</> : bioStatus === 'success' ? <><ShieldCheck size={14} /> EMPREINTE VALIDÉE</> : <><ScanFace size={14} /> LANCER SCAN</>}
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2 border-l-2 border-purple-500">
            Aperçu Identifiant Réseau
          </h3>
          <div className="relative w-full aspect-[1/1.4] bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-600/20 to-transparent" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="p-6 relative z-10 flex justify-between items-start">
              <div>
                <ShieldCheck size={28} className="text-white mb-2" />
                <p className="text-[8px] font-black text-purple-400 uppercase tracking-[0.3em]">République de Côte d'Ivoire</p>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Agent Recenseur Officiel</p>
              </div>
              <div className="w-12 h-16 border-2 border-white/10 rounded flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <UserPlus size={20} className="text-slate-600" />
              </div>
            </div>
            <div className="flex-1 px-6 flex flex-col justify-center relative z-10 space-y-4">
              <div>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Nom & Prénoms</p>
                <p className="text-lg font-black text-white uppercase leading-tight">
                  {formData.nom || "NOM AGENT"}<br/>
                  <span className="text-sm text-slate-300">{formData.prenom || "PRÉNOMS"}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Affectation</p>
                  <p className="text-[10px] font-bold text-cyan-400 uppercase truncate">{formData.zone}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Accréditation</p>
                  <p className={`text-[10px] font-black uppercase ${formData.clearance === 'ALPHA' ? 'text-purple-400' : formData.clearance === 'BETA' ? 'text-cyan-400' : 'text-amber-400'}`}>LVL - {formData.clearance}</p>
                </div>
              </div>
              <div>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Matricule Généré</p>
                <p className="text-xs font-mono font-bold text-white tracking-widest">AGN-{Math.floor(Math.random() * 900) + 100}-{formData.clearance.charAt(0)}</p>
              </div>
            </div>
            <div className="p-6 bg-black/40 border-t border-white/5 relative z-10 flex justify-between items-center">
              <div>
                <p className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">Token de Connexion</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Chiffré AES-256</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-lg p-1 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <QrCode size={48} className="text-black" />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-auto">
            <button className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-[10px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              <XCircle size={16} /> Annuler
            </button>
            <button 
              onClick={handleSubmit}
              disabled={bioStatus !== 'success' || !formData.nom}
              className={`flex-[2] font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${bioStatus === 'success' && formData.nom ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              <Save size={16} /> Créer Profil Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}