/**
 * DONNÉES DE DÉMONSTRATION
 * Utilisées quand le backend est indisponible (mode présentation).
 * Retournées par l'intercepteur axios si le token commence par "demo_token_".
 */

// ─── Stats dashboard ──────────────────────────────────────────────────────────
export const DEMO_DASHBOARD = {
  citizens: { total: 29_389_142, pending: 847, validated: 28_388_295 },
  agents: 1_243,
  incidents: 312,
  vitalEvents: {
    births: 4_821,
    deaths: 1_203,
    marriages: 892,
    divorces: 134,
    migrations: 2_456,
  },
};

export const DEMO_MAIRIE = {
  births: 312,
  marriages: 87,
  pendingEvents: 43,
  agents: 28,
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const DEMO_NOTIFICATIONS = [
  { id: '1', title: 'Bienvenue sur RecensCI', message: 'Votre compte est actif.', read: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Mise à jour disponible', message: 'Version 2.1 disponible.', read: true, createdAt: new Date().toISOString() },
  { id: '3', title: 'Alerte sanitaire', message: 'Campagne de vaccination — Abidjan Nord.', read: false, createdAt: new Date().toISOString() },
];

// ─── Citoyens ─────────────────────────────────────────────────────────────────
export const DEMO_CITIZENS = [
  { id: 'c1', nni: 'CI-0001-2024', fullName: 'Kouassi Jean', city: 'Abidjan', status: 'VALIDE' },
  { id: 'c2', nni: 'CI-0002-2024', fullName: 'Koné Aya Marie', city: 'Bouaké', status: 'VALIDE' },
  { id: 'c3', nni: 'CI-0003-2024', fullName: 'Traoré Moussa', city: 'Yamoussoukro', status: 'EN_ATTENTE_VALIDATION' },
  { id: 'c4', nni: 'CI-0004-2024', fullName: 'Bamba Fatoumata', city: 'San-Pédro', status: 'VALIDE' },
  { id: 'c5', nni: 'CI-0005-2024', fullName: 'Diallo Ibrahim', city: 'Korhogo', status: 'EN_ATTENTE_VALIDATION' },
];

// ─── Agents ───────────────────────────────────────────────────────────────────
export const DEMO_AGENTS = [
  { id: 'a1', fullName: 'Agent Koné', email: 'agent.kone@recensci.ci', role: 'AGENT', institutionId: 'inst-cocody' },
  { id: 'a2', fullName: 'Agent Traoré', email: 'agent.traore@recensci.ci', role: 'AGENT', institutionId: 'inst-cocody' },
  { id: 'a3', fullName: 'Agent Bamba', email: 'agent.bamba@recensci.ci', role: 'AGENT', institutionId: 'inst-yopougon' },
];

// ─── Certificats ──────────────────────────────────────────────────────────────
export const DEMO_CERTIFICATES = [
  { id: 'cert1', referenceNumber: 'CERT-1234567890-001', type: 'EXTRAIT_NAISSANCE', status: 'PRET', citizenName: 'Kouassi Jean' },
  { id: 'cert2', referenceNumber: 'CERT-1234567890-002', type: 'CASIER_JUDICIAIRE', status: 'EN_TRAITEMENT', citizenName: 'Koné Aya' },
];

// ─── Incidents ────────────────────────────────────────────────────────────────
export const DEMO_INCIDENTS = [
  { id: 'i1', type: 'ACCIDENT', severity: 'GRAVE', location: 'Carrefour Marcory', status: 'OUVERT', createdAt: new Date().toISOString() },
  { id: 'i2', type: 'HOMICIDE', severity: 'FATAL', location: 'Yopougon', status: 'EN_COURS', createdAt: new Date().toISOString() },
];

// ─── Alertes sanitaires ───────────────────────────────────────────────────────
export const DEMO_HEALTH_ALERTS = [
  { id: 'h1', title: 'Épidémie de paludisme', type: 'Épidémie', severity: 'ELEVE', region: 'Abidjan', status: 'ACTIVE', description: 'Hausse des cas dans les communes nord.' },
  { id: 'h2', title: 'Campagne vaccination', type: 'Prévention', severity: 'FAIBLE', region: 'Bouaké', status: 'SURVEILLEE', description: 'Vaccination contre la méningite.' },
];

// ─── Support tickets ──────────────────────────────────────────────────────────
export const DEMO_TICKETS = [
  { id: 't1', subject: 'Erreur acte de naissance', category: 'Acte civil', priority: 'HAUTE', status: 'OUVERT', description: 'Erreur sur le prénom.' },
];

// ─── Réponse générique succès pour les POST ───────────────────────────────────
export const DEMO_SUCCESS = (type = 'record') => ({
  id: `demo-${Date.now()}`,
  referenceNumber: `DEMO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  status: 'EN_ATTENTE_VALIDATION',
  message: `[DÉMO] ${type} enregistré avec succès`,
  createdAt: new Date().toISOString(),
});

// ─── Routing table : url pattern → données démo ───────────────────────────────
export function getDemoResponse(method: string, url: string): any {
  const u = url.toLowerCase();

  // Auth
  if (u.includes('/auth/me')) return { id: 'demo', fullName: 'Démo User', email: 'demo@recensci.ci', role: 'CITIZEN' };

  // Analytics
  if (u.includes('/analytics/dashboard')) return DEMO_DASHBOARD;
  if (u.includes('/analytics/mairie')) return DEMO_MAIRIE;

  // Notifications
  if (u.includes('/notifications')) return DEMO_NOTIFICATIONS;

  // Citoyens
  if (u.includes('/citizens') && method === 'GET') return { data: DEMO_CITIZENS, total: DEMO_CITIZENS.length };

  // Agents
  if (u.includes('/agents') && method === 'GET') return { data: DEMO_AGENTS, total: DEMO_AGENTS.length };

  // Certificats
  if (u.includes('/certificates/track')) return DEMO_CERTIFICATES[0];
  if (u.includes('/certificates') && method === 'GET') return { data: DEMO_CERTIFICATES, total: DEMO_CERTIFICATES.length };

  // Incidents / sécurité
  if (u.includes('/security/incidents') && method === 'GET') return { data: DEMO_INCIDENTS, total: DEMO_INCIDENTS.length };
  if (u.includes('/security/map')) return DEMO_INCIDENTS;

  // Alertes sanitaires
  if (u.includes('/health-alerts') && method === 'GET') return DEMO_HEALTH_ALERTS;

  // Support
  if (u.includes('/support') && method === 'GET') return DEMO_TICKETS;

  // Tous les POST/PATCH → succès simulé
  if (method === 'POST') return DEMO_SUCCESS('Demande');
  if (method === 'PATCH') return DEMO_SUCCESS('Mise à jour');

  // Fallback
  return { data: [], total: 0 };
}
