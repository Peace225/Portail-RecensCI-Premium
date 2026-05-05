// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- Composants Communs ---
import Header from "./components/Header";
import HeaderStats from "./components/HeaderStats"; 
import StatsDashboard from "./pages/StatsDashboard";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

// --- Hooks & Sécurité ---
import { useAuth } from "./hooks/useAuth";

// --- Layouts ---
import AgentLayout from "./layouts/AgentLayout";
import CitizenLayout from "./layouts/CitizenLayout";
import BackofficeLayout from "./layouts/BackofficeLayout";

// --- Pages Citoyennes ---
import CitizenProfile from "./pages/Citizen/CitizenProfile";
import CitizenRequests from "./pages/Citizen/CitizenRequests";
import CitizenEmergency from "./pages/Citizen/CitizenEmergency";
import CitizenDeclaration from "./pages/Citizen/CitizenDeclaration";
import CensusDetails from "./pages/Citizen/CensusDetails"; 
import AddressChange from "./pages/Citizen/AddressChange";
import SocialSecurityView from "./pages/Citizen/SocialSecurityView";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import Notifications from "./pages/Citizen/Notifications";
import BirthDeclaration from "./pages/Citizen/BirthDeclaration";
import DeathDeclaration from "./pages/Citizen/DeathDeclaration";
import CoffreFort from "./pages/Citizen/CoffreFort";
import SuiviLivraison from "./pages/Citizen/SuiviLivraison";
import FormulaireActe from "./pages/Citizen/FormulaireActe";
import FormulaireJuridique from "./pages/Citizen/FormulaireJuridique";
import FormulaireDeplacement from "./pages/Citizen/FormulaireDeplacement";
import ModuleSante from "./pages/Citizen/ModuleSante";
import ModuleJuridique from "./pages/Citizen/ModuleJuridique";

// Pages Démarches, Justice & Mobilité
import DemandeActes from "./pages/Citizen/DemandeActes";
import DocumentsJuridiques from "./pages/Citizen/DocumentsJuridiques";
import Deplacements from "./pages/Citizen/Deplacements";

// Assistance
import UrgenceSante from "./pages/Citizen/UrgenceSante";
import SOSJuridique from "./pages/Citizen/SOSJuridique";

// --- Imports Portail Mairie ---
import MairieLayout from "./layouts/MairieLayout";
import MairieDashboard from "./backoffice/portails/mairie/MairieDashboard";
import MairieDepartments from "./backoffice/portails/mairie/MairieDepartments";
import MairieAgents from "./backoffice/portails/mairie/MairieAgents";
import MairieRegistres from "./backoffice/portails/mairie/MairieRegistres";
import MairieParametres from "./backoffice/portails/mairie/MairieParametres";

// --- Imports Portail Police
import PoliceLayout from "./layouts/PoliceLayout";
import PoliceDashboard from "./backoffice/portails/police/PoliceDashboard";
import PoliceAgents from "./backoffice/portails/police/PoliceAgents";

// --- Pages Système ---
import MainDashboard from "./pages/MainDashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import BackofficeDashboard from "./backoffice/BackofficeDashboard";

// --- Modules Agent ---
import BirthForm from "./modules/BirthForm";
import DeathForm from "./modules/DeathForm";
import MarriageForm from "./modules/MarriageForm";
import DivorceForm from "./modules/DivorceForm";
import DataExportModule from "./pages/Exports/DataExportModule";

// --- Imports Backoffice ---
import AddAgent from "./backoffice/agents/AddAgent";
import AgentList from "./backoffice/agents/AgentList";
import AgentData from "./backoffice/agents/AgentData";
import AgentMessages from "./backoffice/agents/AgentMessages";
import CitizenFlux from "./backoffice/citoyen/CitizenFlux";
import CitizenDatabase from "./backoffice/citoyen/CitizenDatabase";
import CitizenValidation from "./backoffice/citoyen/CitizenValidation";

/* ==========================================
   🛡️ GARDIEN DE SÉCURITÉ UNIFIÉ (RBAC)
   ========================================== */
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isLoggedIn, loading, role } = useAuth();
  
  if (loading) return <Loader fullScreen text="Vérification de l'identité numérique..." />;
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  
  if (role && !allowedRoles.includes(role)) {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/backoffice" replace />;
    if (role === 'ENTITY_ADMIN') return <Navigate to="/portail/mairie" replace />;
    if (role === 'AGENT') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/me" replace />;
  }
  
  return <>{children}</>;
};

/* ==========================================
   🚪 REDIRECTEUR POUR LES CONNECTÉS
   ========================================== */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading, role } = useAuth();

  if (loading) return <Loader fullScreen text="Chargement..." />;

  if (isLoggedIn) {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return <Navigate to="/backoffice" replace />;
    if (role === 'ENTITY_ADMIN') return <Navigate to="/portail/mairie" replace />;
    if (role === 'AGENT') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/me" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#020617]">
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
          }} 
        />
        
        <HeaderStats /> 

        <div className="pt-8">
          <Header />
        </div>

        <main className="flex-1">
          <Routes>
            {/* 1. ROUTES PUBLIQUES */}
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<StatsDashboard />} />
            
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

            {/* 2. ESPACE CITOYEN (SÉCURISÉ) */}
            <Route element={<ProtectedRoute allowedRoles={['CITIZEN']}><CitizenLayout /></ProtectedRoute>}>
              <Route path="/me" element={<CitizenDashboard />} />
              <Route path="/mon-profil" element={<CitizenProfile />} />
              <Route path="/recensement-details" element={<CensusDetails />} />
              <Route path="/migrations" element={<AddressChange />} />
              <Route path="/prestations" element={<SocialSecurityView />} />
              <Route path="/declarer-naissance" element={<BirthDeclaration />} /> 
              <Route path="/declarer-statut" element={<CitizenDeclaration />} />
              <Route path="/declarer-deces" element={<DeathDeclaration />} />
              
              <Route path="/demande-actes" element={<DemandeActes />} />
              <Route path="/documents/coffre-fort" element={<CoffreFort />} />
              <Route path="/mes-demandes/suivi-livraison" element={<SuiviLivraison />} />
              <Route path="/demande-actes/:type" element={<FormulaireActe />} />
              <Route path="/documents-juridiques" element={<DocumentsJuridiques />} />
              <Route path="/documents-juridiques/:type" element={<FormulaireJuridique />} />
              <Route path="/deplacements" element={<Deplacements />} />
              <Route path="/deplacements/:type" element={<FormulaireDeplacement />} />
              
              <Route path="/urgence-sante" element={<UrgenceSante />} />
              <Route path="/urgence-sante/:action" element={<ModuleSante />} />
              <Route path="/sos-juridique" element={<SOSJuridique />} />
              <Route path="/sos-juridique/:action" element={<ModuleJuridique />} />
              
              <Route path="/mes-demandes" element={<CitizenRequests />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/aide" element={<CitizenEmergency />} />
            </Route>

            {/* PORTAIL MAIRIE */}
            <Route path="/portail/mairie" element={<ProtectedRoute allowedRoles={['ENTITY_ADMIN', 'SUPER_ADMIN']}><MairieLayout /></ProtectedRoute>}>
              <Route index element={<MairieDashboard />} />
              <Route path="departements" element={<MairieDepartments />} />
              <Route path="agents" element={<MairieAgents />} />
              <Route path="registres" element={<MairieRegistres />} />
              <Route path="parametres" element={<MairieParametres />} />
            </Route>

            {/* PORTAIL POLICE */}
            <Route path="/portail/police" element={<ProtectedRoute allowedRoles={['ENTITY_ADMIN', 'SUPER_ADMIN']}><PoliceLayout /></ProtectedRoute>}>
              <Route index element={<PoliceDashboard />} />
              <Route path="agents" element={<PoliceAgents />} />
              <Route path="*" element={<div className="p-10 text-white font-black uppercase tracking-widest text-center">Module Tactique en cours de déploiement...</div>} />
            </Route>

            {/* ESPACE AGENT */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'SUPER_ADMIN']}><AgentLayout /></ProtectedRoute>}>
              <Route index element={<MainDashboard />} />
              <Route path="naissances" element={<BirthForm />} />
              <Route path="mariages" element={<MarriageForm />} />
              <Route path="deces" element={<DeathForm />} />
              <Route path="exports" element={<DataExportModule />} />
              <Route path="parametres" element={<Settings />} />
            </Route>

            {/* BACKOFFICE / HYPERVISEUR */}
            <Route path="/backoffice" element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><BackofficeLayout /></ProtectedRoute>}>
              <Route index element={<BackofficeDashboard />} />
              <Route path="agents/add" element={<AddAgent />} />
              <Route path="agents/list" element={<AgentList />} />
              <Route path="agents/data" element={<AgentData />} />
              <Route path="agents/messages" element={<AgentMessages />} />
              <Route path="citoyen/flux" element={<CitizenFlux />} />
              <Route path="citoyen/database" element={<CitizenDatabase />} />
              <Route path="citoyen/validation" element={<CitizenValidation />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;