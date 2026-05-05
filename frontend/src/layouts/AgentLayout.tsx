// src/layouts/AgentLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // La sidebar sombre
import Header from "../components/Header";

const AgentLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="z-10 bg-white shadow-sm border-b border-slate-200">
          <Header />
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