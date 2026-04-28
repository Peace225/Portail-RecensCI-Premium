// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// --- Imports Portail Mairie ---
import MairieLayout from "./layouts/MairieLayout";
import MairieDashboard from "./backoffice/portails/mairie/MairieDashboard";
import MairieDepartments from "./backoffice/portails/mairie/MairieDepartments";
import MairieAgents from "./backoffice/portails/mairie/MairieAgents";

// 👉 NOUVEAUX IMPORTS : Portail Police
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
import IncidentReportForm from "./pages/Security/IncidentReportForm";
import IncidentMap from "./pages/Security/IncidentMap";
import MigrationFlowForm from "./pages/Migration/MigrationFlowForm";
import AccidentForm from "./modules/AccidentForm";
import HomicideForm from "./modules/Security/HomicideForm";
import MaternalHealthForm from "./modules/MaternalHealthForm";
import InternationalFlowForm from "./modules/InternationalFlowForm";
import InternalMigrationForm from "./modules/InternalMigrationForm";
import ComingSoon from "./pages/ComingSoon";
import CertificateRequest from "./pages/Citizen/CertificateRequest";
import HealthAlerts from "./pages/Health/HealthAlerts";
import Support from "./pages/Support";
import CustomaryMarriageForm from "./modules/CustomaryMarriageForm";
import OutOfFacilityBirthForm from "./modules/OutOfFacilityBirthForm";

// --- Imports Backoffice (Accréditation & Citoyen) ---
import AddAgent from "./backoffice/agents/AddAgent";
import AgentList from "./backoffice/agents/AgentList";
import AgentData from "./backoffice/agents/AgentData";
import AgentMessages from "./backoffice/agents/AgentMessages";
import CitizenFlux from "./backoffice/citoyen/CitizenFlux";
import CitizenDatabase from "./backoffice/citoyen/CitizenDatabase";
import CitizenValidation from "./backoffice/citoyen/CitizenValidation";
import AnalyticsPanel from "./backoffice/AnalyticsPanel";
import EventFeed from "./backoffice/EventFeed";
import Reports from "./backoffice/Reports";
import UsersManagement from "./backoffice/UsersManagement";

/* ==========================================
   🛡️ GARDIEN DE SÉCURITÉ UNIFIÉ (RBAC)
   ========================================== */
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isLoggedIn, loading, role } = useAuth();
  
  if (loading) return <Loader fullScreen text="Vérification de l'identité numérique..." />;
  
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  
  // Si le rôle de l'utilisateur n'est pas autorisé pour cette zone
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
      <AppContent />
    </Router>
  );
};

// Composant interne pour accéder à useLocation
const AppContent: React.FC = () => {
  const location = useLocation();
  
  // Routes qui ont leur propre layout complet — pas de Header/Footer/HeaderStats global
  const isProtectedLayout = 
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/backoffice') ||
    location.pathname.startsWith('/portail') ||
    location.pathname.startsWith('/me') ||
    location.pathname.startsWith('/mon-profil') ||
    location.pathname.startsWith('/recensement-details') ||
    location.pathname.startsWith('/migrations') ||
    location.pathname.startsWith('/prestations') ||
    location.pathname.startsWith('/declarer') ||
    location.pathname.startsWith('/mes-demandes') ||
    location.pathname.startsWith('/notifications') ||
    location.pathname.startsWith('/aide') ||
    location.pathname.startsWith('/certificats') ||
    location.pathname.startsWith('/support');

  return (
    <div className="flex flex-col min-h-screen bg-[#020617]">
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} 
      />
      
      {/* HeaderStats et Header uniquement sur les pages publiques */}
      {!isProtectedLayout && <HeaderStats />}
      {!isProtectedLayout && (
        <div className="pt-8">
          <Header />
        </div>
      )}

      <main className="flex-1">
        <Routes>
            {/* 1. ROUTES PUBLIQUES */}
            <Route path="/" element={<Home />} />
            <Route path="/stats" element={<StatsDashboard />} />
            
            {/* Protégées par PublicOnlyRoute */}
            <Route path="/login" element={
              <PublicOnlyRoute><Login /></PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute><Register /></PublicOnlyRoute>
            } />

            {/* 2. ESPACE CITOYEN (SÉCURISÉ) */}
            <Route 
              element={
                <ProtectedRoute allowedRoles={['CITIZEN']}>
                  <CitizenLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/me" element={<CitizenDashboard />} />
              <Route path="/mon-profil" element={<CitizenProfile />} />
              <Route path="/recensement-details" element={<CensusDetails />} />
              <Route path="/migrations" element={<AddressChange />} />
              <Route path="/prestations" element={<SocialSecurityView />} />
              <Route path="/declarer-naissance" element={<BirthDeclaration />} /> 
              <Route path="/declarer-statut" element={<CitizenDeclaration />} />
              <Route path="/declarer-deces" element={<DeathDeclaration />} />
              <Route path="/mes-demandes" element={<CitizenRequests />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/aide" element={<CitizenEmergency />} />
              <Route path="/certificats" element={<CertificateRequest />} />
              <Route path="/support" element={<Support />} />
            </Route>

            {/* ======================================================
                PORTAIL ENTITÉ : MAIRIE (Accès Admin Mairie)
                ====================================================== */}
            <Route 
              path="/portail/mairie" 
              element={
                <ProtectedRoute allowedRoles={['ENTITY_ADMIN', 'SUPER_ADMIN']}>
                  <MairieLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MairieDashboard />} />
              <Route path="departements" element={<MairieDepartments />} />
              <Route path="agents" element={<MairieAgents />} />
              <Route path="registres" element={<ComingSoon />} />
              <Route path="parametres" element={<ComingSoon />} />
            </Route>

            {/* ======================================================
                PORTAIL ENTITÉ : POLICE (Accès Préfet/Commissaire)
                ====================================================== */}
            <Route 
              path="/portail/police" 
              element={
                <ProtectedRoute allowedRoles={['ENTITY_ADMIN', 'SUPER_ADMIN']}>
                  <PoliceLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PoliceDashboard />} />
              <Route path="agents" element={<PoliceAgents />} />
              <Route path="*" element={<div className="p-10 text-white font-black uppercase tracking-widest text-center">Module Tactique en cours de déploiement...</div>} />
            </Route>

            {/* 3. ESPACE AGENT (SÉCURISÉ) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'SUPER_ADMIN']}>
                  <AgentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MainDashboard />} />
              <Route path="naissances" element={<BirthForm />} />
              <Route path="mariages" element={<MarriageForm />} />
              <Route path="deces" element={<DeathForm />} />
              <Route path="divorces" element={<DivorceForm />} />
              <Route path="migrations" element={<MigrationFlowForm />} />
              <Route path="migrations-int" element={<InternalMigrationForm />} />
              <Route path="migrations-ext" element={<InternationalFlowForm />} />
              <Route path="accidents" element={<AccidentForm />} />
              <Route path="securite" element={<HomicideForm />} />
              <Route path="sante-maternelle" element={<MaternalHealthForm />} />
              <Route path="mariage-coutumier" element={<CustomaryMarriageForm />} />
              <Route path="naissance-terrain" element={<OutOfFacilityBirthForm />} />
              <Route path="alertes-sante" element={<HealthAlerts />} />
              <Route path="incidents" element={<IncidentReportForm />} />
              <Route path="carte-incidents" element={<IncidentMap />} />
              <Route path="exports" element={<DataExportModule />} />
              <Route path="certificats" element={<CertificateRequest />} />
              <Route path="support" element={<Support />} />
              <Route path="parametres" element={<Settings />} />
            </Route>

            {/* ======================================================
                4. ADMINISTRATION / HYPERVISEUR (ACCÈS RESTREINT)
                ====================================================== */}
            <Route 
              path="/backoffice" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <BackofficeLayout />
                </ProtectedRoute>
              }
            >
              {/* Index de la route /backoffice (La carte globale) */}
              <Route index element={<BackofficeDashboard />} />
              
              {/* --- Modules Accréditation Agents --- */}
              <Route path="agents/add" element={<AddAgent />} />
              <Route path="agents/list" element={<AgentList />} />
              <Route path="agents/data" element={<AgentData />} />
              <Route path="agents/messages" element={<AgentMessages />} />

              {/* --- Modules Portail Citoyen --- */}
              <Route path="citoyen/flux" element={<CitizenFlux />} />
              <Route path="citoyen/database" element={<CitizenDatabase />} />
              <Route path="citoyen/validation" element={<CitizenValidation />} />

              {/* --- Modules Analytics & Admin --- */}
              <Route path="analytics" element={<AnalyticsPanel />} />
              <Route path="events" element={<EventFeed />} />
              <Route path="reports" element={<Reports />} />
              <Route path="users" element={<UsersManagement />} />

              {/* --- Surveillance --- */}
              <Route path="surveillance/video" element={<ComingSoon />} />
              <Route path="surveillance/heatmap" element={<IncidentMap />} />
              <Route path="surveillance/alertes" element={<ComingSoon />} />
              <Route path="surveillance/cyber" element={<ComingSoon />} />

              {/* --- Zones & Terrain --- */}
              <Route path="zones/mapping" element={<ComingSoon />} />
              <Route path="zones/tracking" element={<ComingSoon />} />
              <Route path="zones/logistique" element={<ComingSoon />} />
              <Route path="zones/rendement" element={<ComingSoon />} />

              {/* --- Technique & DevOps --- */}
              <Route path="technique/serveurs" element={<ComingSoon />} />
              <Route path="technique/database" element={<ComingSoon />} />
              <Route path="technique/api" element={<ComingSoon />} />
              <Route path="technique/deployments" element={<ComingSoon />} />

              {/* --- Logs & Réseau --- */}
              <Route path="logs/terminal" element={<ComingSoon />} />
              <Route path="logs/audit" element={<ComingSoon />} />
              <Route path="logs/security" element={<ComingSoon />} />

              {/* --- Paramètres Système --- */}
              <Route path="settings/rules" element={<ComingSoon />} />
              <Route path="settings/iam" element={<ComingSoon />} />
              <Route path="settings/integrations" element={<ComingSoon />} />
              <Route path="settings/display" element={<ComingSoon />} />
            </Route>

            {/* Redirection automatique pour les URLs inconnues vers l'accueil ou 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer uniquement sur les pages publiques */}
        {!isProtectedLayout && <Footer />}
      </div>
  );
};

export default App;