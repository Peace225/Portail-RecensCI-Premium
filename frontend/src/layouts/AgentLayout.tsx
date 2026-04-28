// src/layouts/AgentLayout.tsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Bell } from "lucide-react";

const AgentLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header agent simplifié — sans doublon logout */}
        <header className="z-10 bg-white shadow-sm border-b border-slate-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              {user.name || 'Agent'}
            </span>
            <span className="text-[9px] px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full font-black uppercase tracking-widest">
              {user.role || 'AGENT'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors relative">
              <Bell size={18} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-red-100">
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-[#F8FAFC]">
          <div className="py-8 px-4 sm:px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentLayout;
