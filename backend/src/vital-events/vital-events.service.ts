import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export type EventType = 'birth' | 'death' | 'marriage' | 'divorce' | 'migration';

@Injectable()
export class VitalEventsService {
  constructor(private supabase: SupabaseService) {}

  private getTable(type: EventType) {
    const tables: Record<EventType, string> = {
      birth: 'birth_records',
      death: 'death_records',
      marriage: 'marriage_records',
      divorce: 'divorce_records',
      migration: 'migration_records',
    };
    return tables[type];
  }

  async create(type: EventType, dto: any, agentId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.getTable(type))
      .insert({ ...dto, agent_id: agentId, status: 'EN_ATTENTE_VALIDATION' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(type: EventType, filters: { status?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, status } = filters;
    let query = this.supabase
      .getClient()
      .from(this.getTable(type))
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, total: count, page, limit };
  }

  async updateStatus(type: EventType, id: string, status: string, agentId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.getTable(type))
      .update({ status, reviewed_by: agentId, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Sync batch depuis le frontend offline (Redux-persist)
  async syncBatch(events: Array<{ type: EventType; data: any }>, agentId: string) {
    const results = await Promise.allSettled(
      events.map((e) => this.create(e.type, e.data, agentId)),
    );
    return results.map((r, i) => ({
      index: i,
      status: r.status,
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason?.message : null,
    }));
  }
}
