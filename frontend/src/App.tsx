import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- Composants Communs ---
import Header from "./components/Header";
import Footer from "./components/Footer"; // Assure-toi que ce composant existe
import Loader from "./components/Loader";

// --- Hooks & Sécurité ---
import { useAuth } from "./hooks/useAuth";
import useBackofficeAuth from "./backoffice/useBackofficeAuth";

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

// --- Pages Système ---
import MainDashboard from "./pages/MainDashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import BackofficeDashboard from "./backoffice/BackofficeDashboard";

// --- Modules Agent ---
import BirthForm from "./modules/BirthForm";
import DeathForm from "./modules/DeathForm";
import MarriageForm from "./modules/MarriageForm";
import DivorceForm from "./modules/DivorceForm";
import DataExportModule from "./pages/Exports/DataExportModule";

/* --- Gardiens de Routes --- */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <Loader fullScreen text="Initialisation de RecensCI..." />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthorized, loading, isForbidden } = useBackofficeAuth(["ADMIN", "SUPER_ADMIN"]);
  if (loading) return <Loader fullScreen text="Vérification des accès admin..." />;
  if (isForbidden) return <Navigate to="/dashboard" replace />; 
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        
        {/* Header visible sur toutes les pages */}
        <Header />

        <main className="flex-1">
          <Routes>
            {/* 1. ROUTES PUBLIQUES */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* 2. ESPACE CITOYEN */}
            <Route 
              element={
                <ProtectedRoute>
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
              <Route path="/declarer-deces" element={<CitizenDeclaration />} />
              
              <Route path="/mes-demandes" element={<CitizenRequests />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/aide" element={<CitizenEmergency />} />
            </Route>

            {/* 3. ESPACE AGENT */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <AgentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MainDashboard />} />
              <Route path="naissances" element={<BirthForm />} />
              <Route path="mariages" element={<MarriageForm />} />
              <Route path="deces" element={<DeathForm />} />
              <Route path="exports" element={<DataExportModule />} />
              <Route path="parametres" element={<Settings />} />
            </Route>

            {/* 4. ADMINISTRATION */}
            <Route 
              element={
                <AdminRoute>
                  <BackofficeLayout />
                </AdminRoute>
              }
            >
              <Route path="/backoffice" element={<BackofficeDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer visible sur toutes les pages */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;