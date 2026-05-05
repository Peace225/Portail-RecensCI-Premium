import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; 
import { RootState } from "../../../store"; 
import { 
  DollarSign, FileText, TrendingUp, ArrowUpRight, 
  Calendar, ShieldCheck, Key, RefreshCw, 
  Loader2, Trash2, ShieldOff, UserCheck, CheckCircle2, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { toast } from 'react-hot-toast';
import { supabase } from "../../../supabaseClient"; 

// --- DONNÉES FINANCIÈRES SIMULÉES ---
const BASE_REVENUE_HISTORY = [
  { day: 'Lun', montant: 450000 }, { day: 'Mar', montant: 520000 },
  { day: 'Mer', montant: 480000 }, { day: 'Jeu', montant: 610000 },
  { day: 'Ven', montant: 590000 }, { day: 'Sam', montant: 750000 },
  { day: 'Dim', montant: 400000 },
];

const BASE_TAX_BREAKDOWN = [
  { name: 'État Civil', value: 1200000, color: '#f59e0b' }, 
  { name: 'Taxes Marchés', value: 2500000, color: '#10b981' }, 
  { name: 'Voirie/Parking', value: 1800000, color: '#06b6d4' }, 
];

const getCommuneMultiplier = (commune: string) => {
  const hash = commune.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 5) + 0.5; 
};

export default function MairieDashboard() {
  const userState = useSelector((state: RootState) => state.user);
  const communeName = userState?.commune || "Yopougon";

  // --- ÉTATS GESTION DES COMPTES ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [recentAccounts, setRecentAccounts] = useState<any[]>([]);
  
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("AGENT");
  const [password, setPassword] = useState("");

  // --- CALCULS KPI ---
  const dashboardData = useMemo(() => {
    const multiplier = getCommuneMultiplier(communeName);
    return {
      revenueHistory: BASE_REVENUE_HISTORY.map(item => ({ ...item, montant: Math.round(item.montant * multiplier) })),
      taxBreakdown: BASE_TAX_BREAKDOWN.map(item => ({ ...item, value: Math.round(item.value * multiplier) })),
      totalRevenue: Math.round(3800000 * multiplier),
      totalDocs: Math.round(1450 * multiplier),
      recoveryRate: Math.min(99.9, (92.4 + (multiplier * 2))).toFixed(1), 
    };
  }, [communeName]);

  // --- CHARGEMENT DES COMPTES ---
  const fetchAccounts = useCallback(async () => {
    // Si l'ID est manquant, on ne peut pas charger les comptes
    if (!userState.structureId) return;

    setIsLoadingAccounts(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, email, status')
        .eq('institution_id', userState.structureId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setRecentAccounts(data || []);
    } catch (err) {
      console.error("Erreur Fetch Accounts:", err);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [userState.structureId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#*";
    let newPwd = "";
    for (let i = 0; i < 10; i++) newPwd += chars.charAt(Math.floor(Math.random() * chars.length));
    setPassword(newPwd);
  };

  // --- CRÉATION DE COMPTE (CORRIGÉE) ---
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validation locale
    if (!newName || !newEmail || !password) {
      return toast.error("Tous les champs sont obligatoires.");
    }

    // 2. Vérification de l'ID (La cause de ton erreur)
    if (!userState.structureId) {
      console.error("Structure ID absent dans Redux");
      return toast.error("Impossible de valider : ID de Structure manquant. Déconnectez-vous et reconnectez-vous.");
    }
    
    setIsSubmitting(true);

    try {
      // 3. Insertion Supabase
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          full_name: newName,
          email: newEmail.trim().toLowerCase(),
          role: newRole,
          temp_password: password,
          institution_id: userState.structureId,
          status: 'ACTIVE'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Accréditation validée avec succès.");
      setRecentAccounts(prev => [data, ...prev]);
      
      // Réinitialisation
      setShowCreateForm(false);
      setNewName(""); setNewEmail(""); setPassword("");
    } catch (err: any) {
      console.error("Erreur Insertion Supabase:", err);
      // Message d'erreur précis
      if (err.code === "23505") {
        toast.error("Cet email est déjà utilisé pour un autre agent.");
      } else {
        toast.error(err.message || "Erreur lors de la validation.");
      }
    } finally {
      // ✅ Indispensable : On arrête le spinner dans tous les cas
      setIsSubmitting(false);
    }
  };

  const handleToggleBlock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    try {
      const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setRecentAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, status: newStatus } : acc));
      toast.success(newStatus === 'BLOCKED' ? "Compte suspendu" : "Compte réactivé");
    } catch (err) {
      toast.error("Échec de l'opération.");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm("Action irréversible : révoquer l'accès ?")) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setRecentAccounts(prev => prev.filter(acc => acc.id !== id));
      toast.success("Accès révoqué définitivement.");
    } catch (err) {
      toast.error("Erreur de suppression.");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 w-full text-slate-300 font-sans overflow-y-auto [&::-webkit-scrollbar]:hidden">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={10} /> Espace Exécutif
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
            Mairie de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{communeName}</span>
          </h1>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">République de Côte d&apos;Ivoire • Trésorerie Communale</p>
        </div>
        <div className="px-4 py-2.5 bg-[#050914] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-lg">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase text-white tracking-widest">Avril 2026</span>
        </div>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Recettes Totales" value={dashboardData.totalRevenue.toLocaleString('fr-FR')} unit="FCFA" trend="+18%" icon={<DollarSign size={20} className="text-emerald-400" />} colorTheme="emerald" />
        <StatCard title="Documents Délivrés" value={dashboardData.totalDocs.toLocaleString('fr-FR')} unit="UNITÉS" trend="+5.2%" icon={<FileText size={20} className="text-amber-400" />} colorTheme="amber" />
        <StatCard title="Taux Recouvrement" value={dashboardData.recoveryRate} unit="%" trend="+2.1%" icon={<TrendingUp size={20} className="text-cyan-400" />} colorTheme="cyan" />
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] shadow-2xl h-[320px] flex flex-col">
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">Flux des encaissements</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardData.revenueHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs><linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={9} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="montant" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] shadow-2xl h-[320px] flex flex-col">
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 text-center">Répartition par Direction</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.taxBreakdown} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} fontWeight="black" width={80} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={12}>
                  {dashboardData.taxBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GESTION ACCRÉDITATIONS */}
      <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-6 rounded-[1.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 opacity-30" />
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Key size={14} className="text-blue-500" /> Gestion des Accréditations</h3>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black uppercase text-[9px] tracking-widest transition-all">
            {showCreateForm ? 'Fermer' : 'Créer un accès'}
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateAccount} className="mb-8 p-5 bg-black/40 border border-blue-500/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nom Complet" className="bg-[#020617] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500" />
              <input required type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email Agent" className="bg-[#020617] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500" />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="bg-[#020617] border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500">
                <option value="AGENT">Agent de Service</option>
                <option value="CHEF_SERVICE">Chef de Service</option>
                <option value="DIRECTEUR">Directeur</option>
              </select>
              <div className="relative">
                <input required type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Clé de Sécurité" className="w-full bg-[#020617] border border-white/10 rounded-xl p-3 text-xs text-white font-mono outline-none" />
                <button type="button" onClick={generatePassword} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-white transition-colors"><RefreshCw size={14} /></button>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-white/5">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl font-black uppercase text-[10px] hover:bg-blue-500 hover:text-white transition-all">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Valider l&apos;Accréditation
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {isLoadingAccounts ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-600" /></div>
          ) : (
            recentAccounts.map((acc) => (
              <div key={acc.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${acc.status === 'BLOCKED' ? 'bg-rose-500/5 border-rose-500/10 grayscale' : 'bg-white/5 border-white/5 hover:border-blue-500/30'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black border ${acc.status === 'BLOCKED' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-900 border-white/10 text-blue-500'}`}>
                    {acc.full_name?.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">{acc.full_name} {acc.status === 'ACTIVE' && <CheckCircle2 size={12} className="inline ml-1 text-emerald-500" />}</h4>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{acc.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggleBlock(acc.id, acc.status)} className="p-2.5 rounded-xl border bg-white/5 border-white/5 text-slate-400 hover:text-amber-500 transition-all">
                    {acc.status === 'BLOCKED' ? <UserCheck size={16} /> : <ShieldOff size={16} />}
                  </button>
                  <button onClick={() => handleDeleteAccount(acc.id)} className="p-2.5 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- KPI CARD ---
function StatCard({ title, value, unit, trend, icon, colorTheme }: any) {
  const themes: any = {
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", line: "bg-emerald-500", text: "text-emerald-400" },
    amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", line: "bg-amber-500", text: "text-amber-400" },
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", line: "bg-cyan-500", text: "text-cyan-400" },
  };
  const theme = themes[colorTheme] || themes.emerald;

  return (
    <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-5 rounded-[2rem] relative overflow-hidden group transition-all hover:bg-[#0a0f1e]">
      <div className={`absolute top-0 left-0 w-full h-1 ${theme.line} opacity-30 group-hover:opacity-100 transition-opacity`} />
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 ${theme.bg} rounded-xl border ${theme.border} group-hover:scale-110 transition-transform duration-300`}>{icon}</div>
        <div className="text-[9px] font-black text-white bg-white/10 px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"><ArrowUpRight size={10} className={theme.text} /> {trend}</div>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5"><p className="text-3xl font-black text-white tracking-tighter italic">{value}</p><p className="text-[10px] font-black text-slate-600 uppercase">{unit}</p></div>
      </div>
    </div>
  );
}