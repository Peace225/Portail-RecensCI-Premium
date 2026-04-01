import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.client = createClient(
      this.config.get('SUPABASE_URL'),
      this.config.get('SUPABASE_SERVICE_ROLE_KEY'), // Service role = accès admin complet
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
