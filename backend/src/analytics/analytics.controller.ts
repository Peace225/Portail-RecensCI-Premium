import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Statistiques globales du dashboard', description: 'Utilisé par Overview.tsx et AnalyticsPanel.tsx' })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('trend')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Tendance mensuelle naissances/décès (6 mois)', description: 'Utilisé par les graphiques Overview.tsx' })
  getMonthlyTrend() {
    return this.analyticsService.getMonthlyTrend();
  }

  @Get('mairie')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Statistiques portail Mairie', description: 'Utilisé par MairieDashboard.tsx' })
  getMairieStats(@Request() req) {
    const institutionId = req.user.role === 'ENTITY_ADMIN' ? req.user.institutionId : undefined;
    return this.analyticsService.getMairieStats(institutionId);
  }

  @Get('police')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Statistiques portail Police', description: 'Utilisé par PoliceDashboard.tsx' })
  getPoliceStats(@Request() req) {
    const institutionId = req.user.role === 'ENTITY_ADMIN' ? req.user.institutionId : undefined;
    return this.analyticsService.getPoliceStats(institutionId);
  }
}
