import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CitizensModule } from './citizens/citizens.module';
import { VitalEventsModule } from './vital-events/vital-events.module';
import { AgentsModule } from './agents/agents.module';
import { SecurityModule } from './security/security.module';
import { ExportsModule } from './exports/exports.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting global
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    SupabaseModule,
    AuthModule,
    CitizensModule,
    VitalEventsModule,
    AgentsModule,
    SecurityModule,
    ExportsModule,
  ],
})
export class AppModule {}
