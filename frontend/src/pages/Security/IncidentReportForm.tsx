// src/pages/Security/IncidentReportForm.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEventToQueue } from "../../store/vitalEventSlice";
import { notify } from "../../services/notificationService";
import { Card, CardContent } from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { v4 as uuidv4 } from "uuid";

interface Props {
  mode: 'ACCIDENT' | 'HOMICIDE';
}

const IncidentReportForm: React.FC<Props> = ({ mode }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Capture GPS pour la carte de chaleur (Heatmap)
    navigator.geolocation.getCurrentPosition((pos) => {
      const incident = {
        id: uuidv4(),
        type: mode === 'ACCIDENT' ? 'ACCIDENT_ROUTE' : 'HOMICIDE',
        status: 'PENDING' as const,
        agentId: "POLICE_ID_789", // À extraire du store Auth
        structureId: "COMMISSARIAT_YOP_04",
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        data: rawData,
        createdAt: new Date().toISOString(),
        attachments: []
      };

      dispatch(addEventToQueue(incident as any));
      notify.success(`${mode} enregistré et géolocalisé.`);
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-xl ${mode === 'ACCIDENT' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          {mode === 'ACCIDENT' ? '🚗' : '🛡️'}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Signalement : {mode}</h2>
          <p className="text-sm text-gray-500">Unité d'intervention : Brigade de Sécurité Publique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche : Détails de l'incident */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Détails de l'incident">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Input name="incidentDate" label="Date et Heure précise" type="datetime-local" required />
              <Input name="locationName" label="Point de repère (ex: Carrefour Akwaba)" required />
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé des faits</label>
                <textarea 
                  name="summary" 
                  rows={4} 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Décrivez brièvement les circonstances..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card title="Victimes et Gravité">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <Input name="victimCount" label="Nombre de victimes" type="number" />
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Gravité constatée</label>
                <select name="severity" className="rounded-lg border-gray-300">
                  <option value="LÉGER">Dommages matériels / Blessés légers</option>
                  <option value="GRAVE">Blessés graves / Pronostic engagé</option>
                  <option value="FATAL">Décès constaté sur place</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite : Spécificités & Preuves */}
        <div className="space-y-6">
          <Card title="Classification Métier">
            <CardContent className="p-4 space-y-4">
              {mode === 'HOMICIDE' ? (
                <div>
                  <label className="text-sm font-medium text-gray-700">Arme utilisée</label>
                  <select name="weaponType" className="w-full mt-1 rounded-lg border-gray-300">
                    <option value="FEU">Arme à feu</option>
                    <option value="BLANCHE">Arme blanche</option>
                    <option value="AUTRE">Objet contendant / Autre</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-700">Type de collision</label>
                  <select name="collisionType" className="w-full mt-1 rounded-lg border-gray-300">
                    <option value="FRONTAL">Choc frontal</option>
                    <option value="PIETON">Renversement piéton</option>
                    <option value="SOLO">Sortie de route seule</option>
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card title="Preuves de Terrain">
            <CardContent className="p-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <p className="text-xs text-gray-500 mb-4">Capturez des photos des plaques ou du périmètre</p>
                <Button type="button" variant="outline" size="sm">📸 Prendre une photo</Button>
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <Button type="submit" className="w-full h-12 text-lg" isLoading={loading}>
              Valider le signalement
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IncidentReportForm;