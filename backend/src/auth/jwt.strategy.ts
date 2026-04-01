import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private supabase: SupabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('SUPABASE_JWT_SECRET'),
    });
  }

  // Le token Supabase contient sub (user id) et role
  async validate(payload: any) {
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('id, role, full_name, institution_id')
      .eq('id', payload.sub)
      .single();

    if (!profile) {
      // Citoyen sans profil admin
      return { id: payload.sub, role: 'CITIZEN', email: payload.email };
    }

    return {
      id: profile.id,
      role: profile.role,
      name: profile.full_name,
      institutionId: profile.institution_id,
    };
  }
}
