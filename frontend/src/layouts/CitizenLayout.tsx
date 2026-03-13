// src/layouts/CitizenLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import CitizenSidebar from "../components/CitizenSidebar"; // On va créer ce composant
import Header from "../components/Header";

const CitizenLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden font-sans">
      {/* Sidebar plus claire pour le citoyen */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <CitizenSidebar />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <Header />
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 sm:px-6 md:px-10">
            <div className="max-w-5xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;