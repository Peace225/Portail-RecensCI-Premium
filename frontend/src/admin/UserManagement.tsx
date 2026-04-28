// src/admin/UserManagement.tsx
import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

const UserManagement: React.FC = () => {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiService.get<any[]>('/citizens').catch(() => []),
      apiService.get<any[]>('/agents').catch(() => []),
    ]).then(([c, a]) => {
      setCitizens(c || []);
      setAgents(a || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Chargement...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <h1 className="text-2xl font-black text-white uppercase italic">Gestion des Utilisateurs</h1>

      <section>
        <h2 className="text-lg font-black text-orange-400 uppercase mb-4">Citoyens ({citizens.length})</h2>
        <div className="space-y-2">
          {citizens.map((c: any) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">{c.fullName || c.name || '—'}</p>
                <p className="text-xs text-slate-500">{c.nni || c.email || '—'}</p>
              </div>
              <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">Citoyen</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black text-blue-400 uppercase mb-4">Agents ({agents.length})</h2>
        <div className="space-y-2">
          {agents.map((a: any) => (
            <div key={a.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-white">{a.fullName || a.name || '—'}</p>
                <p className="text-xs text-slate-500">{a.email || '—'}</p>
              </div>
              <span className="text-[9px] font-black text-blue-400 uppercase bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{a.role || 'Agent'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
