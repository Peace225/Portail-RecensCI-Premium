// src/admin/SettingsPanel.tsx
import React, { useEffect, useState } from "react";
import { apiService } from "../services/apiService";

const SettingsPanel: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.get<any>('/auth/me').then(setUserData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Chargement...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-black text-white uppercase italic">Paramètres du Compte</h1>

      {userData ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nom complet</p>
            <p className="text-sm font-bold text-white">{userData.fullName || userData.name || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email</p>
            <p className="text-sm font-bold text-white">{userData.email || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Rôle</p>
            <p className="text-sm font-bold text-white">{userData.role || '—'}</p>
          </div>
          {userData.nni && (
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">NNI</p>
              <p className="text-sm font-bold text-white font-mono">{userData.nni}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-slate-500 text-sm">
          Impossible de charger les données utilisateur.
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
