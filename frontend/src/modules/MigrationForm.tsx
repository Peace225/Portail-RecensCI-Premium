// src/modules/MigrationForm.tsx
import React, { useState } from "react";
import { apiService } from "../services/apiService";
import { toast } from "react-hot-toast";

const MigrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fromCountry: "",
    toCountry: "",
    migrationDate: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/events/migration', {
        citizenName: formData.fullName,
        originCity: formData.fromCountry,
        destinationCity: formData.toCountry,
        migrationType: 'INTERNATIONAL',
        migrationDate: formData.migrationDate,
      });
      toast.success("Migration enregistrée avec succès");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Migration Registration</h2>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input name="fromCountry" placeholder="From Country" onChange={handleChange} />
      <input name="toCountry" placeholder="To Country" onChange={handleChange} />
      <input name="migrationDate" type="date" onChange={handleChange} />
      <button type="submit" disabled={loading}>Submit</button>
    </form>
  );
};

export default MigrationForm;