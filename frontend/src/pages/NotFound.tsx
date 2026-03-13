// src/pages/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Garder le Header permet à l'usager de ne pas se sentir perdu */}
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-xl">
          
          {/* Icône visuelle pour adoucir l'erreur */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <DocumentSearchIcon className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Document ou page introuvable
          </h2>
          
          {/* Message rassurant, très important dans le contexte de l'état civil */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            L'adresse URL que vous avez saisie est incorrecte, ou la page a été déplacée. 
            S'il s'agit d'une démarche d'état civil en cours, ne vous inquiétez pas, vos données sauvegardées ne sont pas affectées.
          </p>
          
          {/* Actions de secours multiples */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} // Retourne à la page précédente dans l'historique
              leftIcon={<ArrowLeftIcon className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Page précédente
            </Button>
            <Button 
              onClick={() => navigate("/")}
              leftIcon={<HomeIcon className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Retour à l'accueil
            </Button>
          </div>

          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Si le problème persiste de manière anormale, veuillez contacter le{" "}
              <button onClick={() => navigate("/contact")} className="text-orange-600 hover:underline font-medium focus:outline-none">
                support technique
              </button>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

/* --- Icônes (Heroicons) --- */
const DocumentSearchIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 6H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
);
const ArrowLeftIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const HomeIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);