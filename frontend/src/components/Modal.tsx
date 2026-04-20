// src/components/Modal.tsx
import React, { useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  // Permet de forcer l'utilisateur à cliquer sur un bouton d'action (ex: "Accepter")
  preventOutsideClick?: boolean; 
  // Gère la largeur maximale selon le contenu
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  preventOutsideClick = false,
  maxWidth = "md",
}) => {
  // 1. Gestion de la touche Échap et du blocage du scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventOutsideClick) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Bloque le scroll de la page en arrière-plan
      document.body.style.overflow = "hidden";
    }

    // Nettoyage lors de la fermeture ou du démontage
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, preventOutsideClick]);

  if (!isOpen) return null;

  // Dictionnaire des largeurs
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  // 2. Gestion du clic sur le fond sombre
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !preventOutsideClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Conteneur de la modale avec animation d'apparition */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${maxWidthClasses[maxWidth]}`}
      >
        {/* En-tête de la modale (optionnel, avec bouton croix) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title ? (
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          ) : (
            <div></div> // Div vide pour garder la croix à droite via flex-between
          )}
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Fermer la fenêtre"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corps de la modale (avec scroll interne si le contenu est trop long) */}
        <div className="px-6 py-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;