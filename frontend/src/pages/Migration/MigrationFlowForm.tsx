// src/pages/Migration/MigrationFlowForm.tsx
import React, { useState } from "react";
import { Card, CardContent } from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { apiService } from "../../services/apiService";
import { toast } from "react-hot-toast";

const MigrationFlowForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    try {
      await apiService.post('/events/migration', {
        citizenName: raw.fullName || '',
        originCity: raw.nationality || '',
        destinationCity: raw.hostAddress || '',
        migrationType: raw.reason || 'TRAVAIL',
        migrationDate: raw.arrivalDate || '',
      });
      toast.success("Entrée enregistrée avec succès.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Enregistrement de Flux Migratoire</h2>
        <p className="text-gray-500">Contrôle des entrées et résidences (Expatriés / Réfugiés / Travailleurs).</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Identité de l'Individu">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Input name="fullName" label="Nom Complet" required />
            <Input name="nationality" label="Nationalité" required />
            <Input name="passportNumber" label="N° Passeport / Titre de Séjour" required />
            <Input name="birthDate" label="Date de Naissance" type="date" />
          </CardContent>
        </Card>

        <Card title="Détails du Séjour">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Motif du séjour</label>
              <select name="reason" className="rounded-lg border-gray-300">
                <option value="TRAVAIL">Travail / Affaires</option>
                <option value="ETUDES">Études</option>
                <option value="REFUGIE">Statut de Réfugié</option>
                <option value="DIPLOMATIQUE">Mission Diplomatique</option>
                <option value="TOURISME">Tourisme long séjour</option>
              </select>
            </div>
            <Input name="arrivalDate" label="Date d'entrée sur le territoire" type="date" required />
            <Input name="intendedDuration" label="Durée prévue (mois)" type="number" />
            <Input name="hostAddress" label="Adresse de résidence en CI" required />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Annuler</Button>
          <Button type="submit" isLoading={loading}>Valider l'entrée</Button>
        </div>
      </form>
    </div>
  );
};

export default MigrationFlowForm;