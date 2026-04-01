import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  // Vérifie le token Supabase et retourne le profil complet
  async getProfile(userId: string) {
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*, institutions(type, name)')
      .eq('id', userId)
      .single();

    if (profile) return { ...profile, source: 'profiles' };

    // Fallback : citoyen
    const { data: citizen } = await this.supabase
      .getClient()
      .from('citizens')
      .select('id, nni, full_name, email, photo_url')
      .eq('id', userId)
      .single();

    return citizen ? { ...citizen, role: 'CITIZEN', source: 'citizens' } : null;
  }
}
