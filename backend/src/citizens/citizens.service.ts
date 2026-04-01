import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CitizensService {
  constructor(private supabase: SupabaseService) {}

  async findAll(filters: { search?: string; page?: number; limit?: number }) {
    const { page = 1, limit = 20, search } = filters;
    let query = this.supabase
      .getClient()
      .from('citizens')
      .select('*', { count: 'exact' })
      .range((page - 1) * limit, page * limit - 1);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,nni.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    return { data, total: count, page, limit };
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('citizens')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Citoyen introuvable');
    return data;
  }

  async findByNni(nni: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('citizens')
      .select('*')
      .eq('nni', nni)
      .single();

    if (error || !data) throw new NotFoundException('Citoyen introuvable');
    return data;
  }

  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('citizens')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async validate(id: string, agentId: string) {
    return this.update(id, {
      status: 'VALIDATED',
      validated_by: agentId,
      validated_at: new Date().toISOString(),
    });
  }
}
