import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export type Severity = 'LÉGER' | 'GRAVE' | 'FATAL';

@Injectable()
export class SecurityService {
  constructor(private supabase: SupabaseService) {}

  async createIncident(dto: {
    type: string;
    severity: Severity;
    location: string;
    latitude?: number;
    longitude?: number;
    description: string;
    judicial_followup?: boolean;
  }, reportedBy: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('security_incidents')
      .insert({ ...dto, reported_by: reportedBy, status: 'OUVERT' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(filters: { severity?: Severity; status?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, severity, status } = filters;
    let query = this.supabase
      .getClient()
      .from('security_incidents')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (severity) query = query.eq('severity', severity);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, total: count, page, limit };
  }

  // Données pour la carte (IncidentMap.tsx)
  async getMapData() {
    const { data, error } = await this.supabase
      .getClient()
      .from('security_incidents')
      .select('id, type, severity, latitude, longitude, status, created_at')
      .not('latitude', 'is', null);

    if (error) throw new Error(error.message);
    return data;
  }
}
