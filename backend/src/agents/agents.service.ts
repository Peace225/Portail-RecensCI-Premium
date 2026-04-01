import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AgentsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(institutionId?: string) {
    let query = this.supabase
      .getClient()
      .from('profiles')
      .select('*, institutions(name, type)')
      .in('role', ['AGENT', 'ENTITY_ADMIN']);

    if (institutionId) query = query.eq('institution_id', institutionId);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async create(dto: { email: string; full_name: string; role: string; institution_id: string }) {
    // Crée l'utilisateur Supabase Auth + profil
    const { data: authUser, error: authError } = await this.supabase
      .getClient()
      .auth.admin.createUser({
        email: dto.email,
        password: Math.random().toString(36).slice(-10), // Mot de passe temporaire
        email_confirm: true,
      });

    if (authError) throw new Error(authError.message);

    const { data, error } = await this.supabase
      .getClient()
      .from('profiles')
      .insert({
        id: authUser.user.id,
        full_name: dto.full_name,
        role: dto.role,
        institution_id: dto.institution_id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.getClient().auth.admin.deleteUser(id);
    if (error) throw new Error(error.message);
    return { success: true };
  }

  async getMessages(agentId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('agent_messages')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}
