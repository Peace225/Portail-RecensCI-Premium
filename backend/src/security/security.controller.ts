import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SecurityService } from './security.service';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('security')
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  // POST /v1/security/incidents - Déclarer un incident (IncidentReportForm.tsx)
  @Post('incidents')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  createIncident(@Body() body: any, @Request() req) {
    return this.securityService.createIncident(body, req.user.id);
  }

  // GET /v1/security/incidents - Liste des incidents
  @Get('incidents')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  findAll(@Query() query: any) {
    return this.securityService.findAll(query);
  }

  // GET /v1/security/map - Données pour IncidentMap.tsx
  @Get('map')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  getMapData() {
    return this.securityService.getMapData();
  }
}
