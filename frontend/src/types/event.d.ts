// src/types/vitalEvent.ts

// 1. Les types d'actes pris en charge par la plateforme
export type VitalEventType = "NAISSANCE" | "DECES" | "MARIAGE" | "DIVORCE" | "MIGRATION";

// 2. Les états du mode hors-ligne (Offline-first)
export type SyncStatus = "PENDING" | "SYNCING" | "SYNCED" | "ERROR";

// 3. Structure stricte des données d'un acte spécifique (Exemple : Naissance)
export interface BirthData {
  nniMere: string;          // Obligatoire pour la filiation
  nniPere?: string;         // Optionnel (père potentiellement inconnu)
  nomEnfant: string;
  prenomsEnfant: string;
  sexe: "M" | "F";
  dateNaissance: string;    // Format ISO 8601 (ex: 2026-03-12T10:00:00Z)
  lieuNaissance: string;    // Code de la commune ou nom de l'hôpital
  poidsNaissance?: number;  // Utile pour les statistiques de santé publique (INS)
}

// 4. L'interface globale de l'Événement Vital (Ce qui est stocké dans IndexedDB/Redux)
export interface VitalEvent {
  id: string;               // UUID généré localement sur la tablette de l'agent
  type: VitalEventType;     // Permet au backend de savoir dans quelle table l'insérer
  status: SyncStatus;       // État de la synchronisation
  data: BirthData | Record<string, any>; // Extensible à DeathData, MarriageData, etc.
  createdAt: string;        // Date et heure exactes de la saisie
  agentId: string;          // L'identifiant de l'agent qui engage sa responsabilité
  structureId: string;      // Le code de la mairie / sous-préfecture
  errorMessage?: string;    // Renseigné si le serveur rejette l'acte (ex: "Doublon")
}

// 5. Les Payloads pour les actions Redux
// Quand on ajoute un acte localement, le statut "PENDING" est géré par Redux, on l'omet donc du payload
export type AddVitalEventPayload = Omit<VitalEvent, "status">;

export interface RemoveVitalEventPayload {
  id: string;
}

export interface UpdateVitalEventStatusPayload {
  id: string;
  status: SyncStatus;
  errorMessage?: string;
}