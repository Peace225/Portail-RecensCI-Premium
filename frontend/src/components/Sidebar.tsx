// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCircle, Baby, 
  Skull, Heart, Scale, Car, ShieldAlert, 
  Hospital, PlaneTakeoff, MapPinned, Settings, 
  FileOutput, LogOut, ChevronRight
} from "lucide-react";

const menuItems = [
  { 
    group: "Recensement & Population", 
    items: [
      { name: "Vue d'ensemble", path: "/dashboard", icon: <LayoutDashboard size={20} /> }, 
      { name: "Recensement National", path: "/dashboard/recensement", icon: <Users size={20} /> },
      { name: "Mon Profil Citoyen", path: "/dashboard/profil", icon: <UserCircle size={20} /> },
    ]
  },
  { 
    group: "État Civil", 
    items: [
      { name: "Naissances", path: "/dashboard/naissances", icon: <Baby size={20} /> },
      { name: "Décès", path: "/dashboard/deces", icon: <Skull size={20} /> },
      { name: "Mariages", path: "/dashboard/mariages", icon: <Heart size={20} /> }, 
      { name: "Divorces", path: "/dashboard/divorces", icon: <Scale size={20} /> },
    ]
  },
  { 
    group: "Sécurité & Santé", 
    items: [
      { name: "Accidents Routiers", path: "/dashboard/accidents", icon: <Car size={20} /> },
      { name: "Homicides / Enquêtes", path: "/dashboard/securite", icon: <ShieldAlert size={20} /> },
      { name: "Mortalité Maternelle", path: "/dashboard/sante-maternelle", icon: <Hospital size={20} /> },
    ]
  },
  { 
    group: "Migrations", 
    items: [
      { name: "Flux Internationaux", path: "/dashboard/migrations-ext", icon: <PlaneTakeoff size={20} /> },
      { name: "Déplacements Internes", path: "/dashboard/migrations-int", icon: <MapPinned size={20} /> },
    ]
  },
  { 
    group: "Système", 
    items: [
      // ✨ POINT VERS LE BACKOFFICE POUR LE LAYOUT ADMIN ✨
      { name: "Paramètres", path: "/backoffice", icon: <Settings size={20} /> },
      { name: "Exports INS", path: "/dashboard/exports", icon: <FileOutput size={20} /> },
    ]
  }
];

// Utilisation d'un export par défaut pour faciliter l'import dans AgentLayout
const Sidebar = () => {
  return (
    <aside className="w-72 min-w-[288px] shrink-0 bg-[#0F172A] text-white h-screen flex flex-col border-r border-slate-800 shadow-2xl relative z-50">
      
      {/* HEADER : LOGO CI */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/40">
            <span className="font-black text-xl text-white">R</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter flex items-center">
              RECENS<span className="text-orange-500 underline decoration-2 underline-offset-4">CI</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">Portail National</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION : SCROLLABLE */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-8">
        {menuItems.map((group) => (
          <div key={group.group} className="mb-8">
            <h3 className="text-[10px] font-black text-slate-500 mb-4 px-4 uppercase tracking-[0.2em]">
              {group.group}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  // "end" garantit que le lien /dashboard n'est pas actif quand on est sur /dashboard/naissances
                  end={item.path === "/dashboard"}
                  className={({ isActive }) => 
                    `flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-600/20 to-transparent text-orange-500 border-l-4 border-orange-500 shadow-inner' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="transition-transform group-hover:scale-110 duration-300">
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-bold tracking-tight">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* FOOTER : USER AGENT */}
      <div className="p-4 border-t border-slate-800 bg-[#0B1120] shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 border border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-orange-400">
            BA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate">Brad Admin</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-ellipsis">Officier d'enrôlement</p>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors p-1">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;