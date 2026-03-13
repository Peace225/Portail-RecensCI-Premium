// src/components/Loader.tsx
import React from "react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  fullScreen?: boolean;
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  fullScreen = false,
  text,
  className = "",
}) => {
  // Dictionnaire des tailles pour le spinner
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  // Le spinner en lui-même avec son texte éventuel
  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-orange-600 ${sizes[size]}`}
        role="status"
        aria-label="Chargement en cours"
      >
        {/* Texte caché visuellement mais lu par les lecteurs d'écran (Accessibilité) */}
        <span className="sr-only">Chargement en cours...</span>
      </div>
      
      {/* Texte d'accompagnement optionnel */}
      {text && (
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Si on veut bloquer tout l'écran (ex: pendant une sauvegarde critique)
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  // Comportement par défaut (s'adapte à son conteneur parent)
  return spinnerContent;
};

export default Loader;