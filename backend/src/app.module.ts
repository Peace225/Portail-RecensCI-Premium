import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CitizensModule } from './citizens/citizens.module';
import { VitalEventsModule } from './vital-events/vital-events.module';
import { AgentsModule } from './agents/agents.module';
import { SecurityModule } from './security/security.module';
import { ExportsModule } from './exports/exports.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    CitizensModule,
    VitalEventsModule,
    AgentsModule,
    SecurityModule,
    ExportsModule,
    AnalyticsModule,
    NotificationsModule,
    ModulesModule,
  ],
})
export class AppModule {}
