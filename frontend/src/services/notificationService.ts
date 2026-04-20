// src/services/notificationService.ts
import toast, { ToastOptions } from "react-hot-toast";

// Configuration globale du style des Toasts pour coller au Design System (Tailwind)
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
};

export const notify = {
  /**
   * Notification de succès (ex: "Acte de naissance enregistré")
   */
  success: (message: string, id?: string) => {
    toast.success(message, {
      ...defaultOptions,
      id, // Permet d'éviter les notifications en double si l'utilisateur clique plusieurs fois
      style: {
        ...defaultOptions.style,
        background: "#F0FDF4", // green-50
        color: "#166534", // green-800
        border: "1px solid #BBF7D0", // green-200
      },
      iconTheme: {
        primary: "#16A34A", // green-600
        secondary: "#F0FDF4",
      },
    });
  },

  /**
   * Notification d'erreur (ex: "Connexion perdue", "NNI invalide")
   */
  error: (message: string, id?: string) => {
    toast.error(message, {
      ...defaultOptions,
      duration: 6000, // On laisse l'erreur plus longtemps pour que l'agent puisse la lire
      id,
      style: {
        ...defaultOptions.style,
        background: "#FEF2F2", // red-50
        color: "#991B1B", // red-800
        border: "1px solid #FECACA", // red-200
      },
      iconTheme: {
        primary: "#DC2626", // red-600
        secondary: "#FEF2F2",
      },
    });
  },

  /**
   * Notification d'information / Avertissement (ex: "Mise à jour disponible")
   */
  info: (message: string, id?: string) => {
    toast(message, {
      ...defaultOptions,
      id,
      icon: "ℹ️",
      style: {
        ...defaultOptions.style,
        background: "#EFF6FF", // blue-50
        color: "#1E40AF", // blue-800
        border: "1px solid #BFDBFE", // blue-200
      },
    });
  },

  /**
   * Notification de chargement (ex: "Synchronisation des données en cours...")
   * Retourne un ID qu'il faut utiliser avec notify.dismiss(id) ou notify.success(msg, id) pour l'arrêter
   */
  loading: (message: string): string => {
    return toast.loading(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: "#FFF7ED", // orange-50 (Couleur RecensCI)
        color: "#9A3412", // orange-800
        border: "1px solid #FED7AA", // orange-200
      },
    });
  },

  /**
   * Fermer une notification spécifique ou toutes les notifications
   */
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
};