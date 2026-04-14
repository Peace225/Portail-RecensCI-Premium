// src/backoffice/UsersManagement.tsx
import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, UserCheck, Shield, Search, 
  Trash2, Filter, MoreVertical, RefreshCw,
  Fingerprint, Mail, Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [citizens, agents]: [any[], any[]] = await Promise.all([
        apiService.get<any[]>('/citizens').catch(() => []),
        apiService.get<any[]>('/agents').catch(() => []),
      ]);

      let combined = [
        ...(Array.isArray(citizens) ? citizens : []),
        ...(Array.isArray(agents) ? agents.map((a: any) => ({ ...a, role: a.role || 'AGENT' })) : []),
      ];

      if (filterRole !== "ALL") {
        combined = combined.filter(u => u.role === filterRole);
      }

      setUsers(combined);
    } catch (err: any) {
      toast.error("Erreur de synchronisation des registres.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterRole]);

  // Filtrage local pour la recherche par nom ou email
  const filteredUsers = users.filter(u => 
    (u.nom + " " + u.prenoms + u.email).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 relative z-10">
      
      {/* --- BARRE D'OUTILS HUD --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Users className="text-purple-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Gestion des Identités</h2>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Registres Nationaux Connectés</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Recherche */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="RECHERCHER NOM / EMAIL..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-[10px] font-bold text-white uppercase outline-none focus:border-purple-500 transition-all"
            />
          </div>

          {/* Filtre de Rôle */}
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
            {["ALL", "CITIZEN", "AGENT", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filterRole === role ? "bg-purple-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button onClick={fetchUsers} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* --- TABLEAU DES UTILISATEURS --- */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6">Identité & Statut</th>
                <th className="px-8 py-6">NNI / Matricule</th>
                <th className="px-8 py-6">Rôle Système</th>
                <th className="px-8 py-6">Date Inscription</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">
                        Synchronisation des noeuds...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={user.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-black text-purple-400 group-hover:scale-110 transition-transform overflow-hidden">
                          {user.photo_url ? (
                            <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : user.nom?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase">{user.nom} {user.prenoms}</p>
                          <div className="flex items-center gap-2 text-[9px] text-slate-500 font-mono mt-0.5">
                            <Mail size={10} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Fingerprint size={14} className="text-purple-500/50" />
                        <span className="text-[10px] font-mono font-bold tracking-widest">
                          {user.nni || "SANS_NNI_00"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className={`text-[8px] font-black px-3 py-1 rounded-full border tracking-widest ${
                        user.role === "ADMIN" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" :
                        user.role === "AGENT" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                        "bg-slate-800 border-white/10 text-slate-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                        <Calendar size={12} />
                        {new Intl.DateTimeFormat('fr-CI').format(new Date(user.created_at))}
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button className="p-2.5 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                        <button className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;