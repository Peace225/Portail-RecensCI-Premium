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

// ─── Demandes citoyen ─────────────────────────────────────────────────────────
export const DEMO_REQUESTS = [
  { id: 'r1', type: 'EXTRAIT_NAISSANCE', referenceNumber: 'CERT-1234567890-001', status: 'PRET', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'r2', type: 'CASIER_JUDICIAIRE', referenceNumber: 'CJ-1234567890-002', status: 'EN_TRAITEMENT', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'r3', type: 'CNI', referenceNumber: 'CNI-1234567890-003', status: 'EN_ATTENTE_VALIDATION', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// ─── Audit logs ───────────────────────────────────────────────────────────────
export const DEMO_AUDIT_LOGS = [
  { id: 'al1', action: 'LOGIN', resource: 'User', userEmail: 'superadmin@recensci.ci', userRole: 'SUPER_ADMIN', createdAt: new Date().toISOString() },
  { id: 'al2', action: 'CREATE', resource: 'BirthRecord', userEmail: 'agent@recensci.ci', userRole: 'AGENT', description: 'Acte de naissance créé', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'al3', action: 'VALIDATE', resource: 'Citizen', userEmail: 'admin@recensci.ci', userRole: 'ADMIN', description: 'Citoyen validé', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'al4', action: 'EXPORT', resource: 'Report', userEmail: 'superadmin@recensci.ci', userRole: 'SUPER_ADMIN', description: 'Export CSV généré', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

// ─── API Keys ─────────────────────────────────────────────────────────────────
export const DEMO_API_KEYS = [
  { id: 'k1', name: 'Partenaire ONECI', keyPrefix: 'rci_live_oneci', organizationName: 'ONECI', status: 'ACTIVE', rateLimit: 5000, createdAt: new Date().toISOString() },
  { id: 'k2', name: 'Ministère Intérieur', keyPrefix: 'rci_live_mint', organizationName: 'Ministère de l\'Intérieur', status: 'ACTIVE', rateLimit: 10000, createdAt: new Date().toISOString() },
  { id: 'k3', name: 'Ancien partenaire', keyPrefix: 'rci_live_old', organizationName: 'Partenaire Test', status: 'REVOKED', rateLimit: 1000, createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
];

// ─── Stats exports ────────────────────────────────────────────────────────────
export const DEMO_STATS = {
  births: 4821,
  deaths: 1203,
  marriages: 892,
  divorces: 134,
  migrations: 2456,
  citizens: 29389142,
};

// ─── Citoyens en attente ──────────────────────────────────────────────────────
export const DEMO_PENDING_CITIZENS = [
  { id: 'p1', nni: 'CI-0010-2024', fullName: 'Ouattara Seydou', city: 'Abidjan', status: 'EN_ATTENTE_VALIDATION', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'p2', nni: 'CI-0011-2024', fullName: 'Coulibaly Mariam', city: 'Bouaké', status: 'EN_ATTENTE_VALIDATION', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

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

  // Demandes citoyen
  if (u.includes('/requests')) return DEMO_REQUESTS;

  // Citoyens — ordre important : plus spécifique en premier
  if (u.includes('/citizens/pending')) return DEMO_PENDING_CITIZENS;
  if (u.includes('/citizens/flagged')) return DEMO_PENDING_CITIZENS.map(c => ({ ...c, flagReason: 'Doublon potentiel détecté' }));
  if (u.includes('/citizens') && method === 'GET') return DEMO_CITIZENS;

  // Agents
  if (u.includes('/agents') && method === 'GET') return DEMO_AGENTS;

  // Certificats
  if (u.includes('/certificates/track')) return DEMO_CERTIFICATES[0];
  if (u.includes('/certificates') && method === 'GET') return { data: DEMO_CERTIFICATES, total: DEMO_CERTIFICATES.length };

  // Incidents / sécurité
  if (u.includes('/security/incidents') && method === 'GET') return { data: DEMO_INCIDENTS, total: DEMO_INCIDENTS.length };
  if (u.includes('/security/map') || u.includes('/security') && method === 'GET') return DEMO_INCIDENTS;

  // Alertes sanitaires
  if (u.includes('/health-alerts') && method === 'GET') return DEMO_HEALTH_ALERTS;

  // Support
  if (u.includes('/support') && method === 'GET') return DEMO_TICKETS;

  // Admin — audit, api-keys, exports
  if (u.includes('/admin/audit') || u.includes('/audit')) return DEMO_AUDIT_LOGS;
  if (u.includes('/admin/api-keys') || u.includes('/api-keys')) return DEMO_API_KEYS;
  if (u.includes('/exports/stats') || u.includes('/exports')) return DEMO_STATS;

  // Tous les POST/PATCH → succès simulé
  if (method === 'POST') return DEMO_SUCCESS('Demande');
  if (method === 'PATCH') return DEMO_SUCCESS('Mise à jour');

  // Fallback
  return { data: [], total: 0 };
}
