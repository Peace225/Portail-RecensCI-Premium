export interface SecurityData {
  severity: 'LÉGER' | 'GRAVE' | 'FATAL';
  vehicleTypes?: string[];      // Pour les accidents
  weaponType?: 'FEU' | 'BLANCHE' | 'AUTRE' | 'AUCUNE'; // Pour les homicides
  involvedParties: number;
  incidentSummary: string;
  isJudicialFollowUp: boolean; // Lien dossier judiciaire
}