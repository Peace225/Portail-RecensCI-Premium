import React from "react";
import useOfflineSync from "./useOfflineSync";

const AgentDashboard = () => {
  const { data: tasks, loading, error } = useOfflineSync("agentTasks", async () => {
    const res = await fetch("/api/agent/tasks");
    return res.json();
  });

  if (loading) return <p>Chargement des tâches...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Tâches de l'agent</h2>
      <ul>
        {tasks?.map((task: any) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AgentDashboard;