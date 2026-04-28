// src/admin/RolesPermissions.tsx
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Administrateur",
  ADMIN: "Administrateur",
  ENTITY_ADMIN: "Admin Entité",
  AGENT: "Agent Terrain",
  CITIZEN: "Citoyen",
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ["Accès total", "Gestion des utilisateurs", "Analytics", "Sécurité", "Exports"],
  ADMIN: ["Gestion des utilisateurs", "Analytics", "Sécurité"],
  ENTITY_ADMIN: ["Gestion des agents", "Validation des dossiers"],
  AGENT: ["Enrôlement biométrique", "Signalement d'incidents"],
  CITIZEN: ["Déclarations civiles", "Notifications", "Profil"],
};

const RolesPermissions: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.user.role);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-black text-white uppercase italic">Rôles & Permissions</h1>

      {userRole && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6">
          <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Votre rôle actuel</p>
          <p className="text-xl font-black text-white">{ROLE_LABELS[userRole] || userRole}</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(ROLE_LABELS).map(([role, label]) => (
          <div key={role} className={`bg-white/5 border rounded-2xl p-6 ${userRole === role ? 'border-orange-500/40' : 'border-white/10'}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-white uppercase">{label}</h3>
              {userRole === role && (
                <span className="text-[9px] font-black text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 uppercase">Actif</span>
              )}
            </div>
            <ul className="space-y-1">
              {(ROLE_PERMISSIONS[role] || []).map((perm) => (
                <li key={perm} className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                  {perm}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPermissions;
