// src/modules/migrationform.tsx
import React, { useState } from "react";

const MigrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    fromCountry: "",
    toCountry: "",
    migrationDate: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Migration Form Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Migration Registration</h2>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input name="fromCountry" placeholder="From Country" onChange={handleChange} />
      <input name="toCountry" placeholder="To Country" onChange={handleChange} />
      <input name="migrationDate" type="date" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MigrationForm;