// src/layouts/CitizenLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import CitizenSidebar from "../components/CitizenSidebar"; 


const CitizenLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* --- BACKGROUND DIGITAL LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* --- SIDEBAR (CYBER HUD) --- */}
      <aside className="hidden md:flex md:flex-shrink-0 z-50 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <CitizenSidebar />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar bg-transparent">
          {/* On ajoute un padding-top (pt-32) pour laisser de la place au Header fixed */}
          <div className="py-24 md:py-32 px-4 sm:px-6 md:px-10 lg:px-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>

          {/* Décoration de coin (Corner HUD) */}
          <div className="fixed bottom-4 right-4 pointer-events-none opacity-20 hidden lg:block">
            <div className="text-[10px] font-mono text-slate-500 text-right uppercase">
              System_Output: Secured<br />
              Node_ID: CI-RE-992
            </div>
          </div>
        </main>
      </div>

      {/* Styles CSS injectés pour la cohérence IA */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(2, 6, 23, 1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 130, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 130, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CitizenLayout;