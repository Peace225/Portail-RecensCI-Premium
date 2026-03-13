// src/components/Settings.tsx
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import { notify } from "../services/notificationService";

const Settings: React.FC = () => {
  // États locaux pour les paramètres
  const [sessionTimeout, setSessionTimeout] = useState("15");
  const [syncInterval, setSyncInterval] = useState("60");
  const [require2FA, setRequire2FA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);

  // Simulation de chargement des paramètres initiaux
  useEffect(() => {
    // Ici, on utiliserait apiService.get("/settings")
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulation d'un appel API pour sauvegarder les paramètres
      // await apiService.put("/backoffice/settings", { sessionTimeout, require2FA... })
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notify.success("Les paramètres système ont été mis à jour avec succès.");
    } catch (error) {
      notify.error("Erreur lors de la sauvegarde des paramètres.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheckIcon className="w-6 h-6 text-orange-600" />
          Configuration du Système
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ajustez les règles de sécurité, de synchronisation et de comportement global de RecensCI.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section Sécurité & Accès */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-gray-600" />
              Sécurité des Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Expiration de session (minutes)" 
                type="number" 
                min="5" 
                max="120"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                helperText="Déconnecte automatiquement un agent inactif pour des raisons de sécurité."
              />
            </div>
            
            {/* Toggle Switch fait maison avec Tailwind */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100 mt-4 pt-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Double Authentification (A2F) Obligatoire</h4>
                <p className="text-sm text-gray-500">Exige un code SMS pour toutes les connexions des officiers d'état civil.</p>
              </div>
              <button
                type="button"
                onClick={() => setRequire2FA(!require2FA)}
                className={`${
                  require2FA ? 'bg-green-500' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2`}
              >
                <span className={`${
                  require2FA ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Section Synchronisation (Mode Hors-Ligne) */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <WifiIcon className="w-5 h-5 text-gray-600" />
              Politique de Synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Délai max hors-ligne (heures)" 
                type="number" 
                min="1" 
                max="72"
                value={syncInterval}
                onChange={(e) => setSyncInterval(e.target.value)}
                helperText="Le temps maximum autorisé avant qu'une tablette ne se verrouille si elle n'a pas synchronisé ses actes."
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Alertes */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BellAlertIcon className="w-5 h-5 text-gray-600" />
              Alertes Administrateur
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Notifications de Doublons</h4>
                <p className="text-sm text-gray-500">Recevoir un email immédiat quand un NNI est utilisé sur deux actes différents.</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`${
                  emailAlerts ? 'bg-green-500' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2`}
              >
                <span className={`${
                  emailAlerts ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Actions flottantes en bas */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button type="button" variant="ghost" className="mr-3">
            Annuler
          </Button>
          <Button type="submit" isLoading={isSaving} leftIcon={!isSaving && <SaveIcon className="w-5 h-5" />}>
            Enregistrer les modifications
          </Button>
        </div>
        
      </form>
    </div>
  );
};

export default Settings;

/* --- Icônes (Heroicons) --- */
const ShieldCheckIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const LockIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const WifiIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.906 14.142 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>;
const BellAlertIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SaveIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;