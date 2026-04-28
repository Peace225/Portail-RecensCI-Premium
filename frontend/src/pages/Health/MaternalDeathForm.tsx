// src/pages/Health/MaternalDeathForm.tsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { apiService } from "../../services/apiService";

const MaternalDeathForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    try {
      await apiService.post('/events/birth', {
        ...raw,
        type: 'MATERNAL_DEATH',
        babyFirstName: raw.babyFirstName || '',
        babyLastName: raw.babyLastName || '',
        gender: raw.gender || '',
        birthDate: raw.birthDate || '',
        cityOfBirth: raw.cityOfBirth || '',
        motherFullName: raw.motherFullName || '',
        fatherFullName: raw.fatherFullName || '',
        doctorName: raw.doctorName || '',
      });
      toast.success("Décès maternel enregistré.");
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Déclaration de Décès Maternel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la mère</label>
          <input name="motherFullName" className="w-full border border-gray-300 rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date du décès</label>
          <input name="birthDate" type="date" className="w-full border border-gray-300 rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
          <input name="cityOfBirth" className="w-full border border-gray-300 rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Médecin responsable</label>
          <input name="doctorName" className="w-full border border-gray-300 rounded-lg p-3" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all disabled:bg-gray-400"
        >
          {loading ? "Enregistrement..." : "Enregistrer le décès maternel"}
        </button>
      </form>
    </div>
  );
};

export default MaternalDeathForm;
