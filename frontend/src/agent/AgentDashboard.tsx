// src/agent/AgentDashboard.tsx
import React from "react";
import { apiService } from "../services/apiService";
import useOfflineSync from "./OfflineSync";

const AgentDashboard = () => {
  const { data: tasks, loading, error } = useOfflineSync("agentTasks", async () => {
    return apiService.get<any[]>("/analytics/dashboard");
  });

  if (loading) return <p>Chargement des tâches...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Tableau de bord Agent</h2>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  );
};

export default AgentDashboard;