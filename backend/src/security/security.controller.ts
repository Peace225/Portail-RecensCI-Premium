import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse,
  ApiQuery, ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { SecurityService } from './security.service';
import { CreateIncidentDto, IncidentResponseDto } from './dto/incident.dto';

@ApiTags('Security')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('security')
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  @Post('incidents')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Déclarer un incident', description: 'Utilisé par IncidentReportForm.tsx' })
  @ApiBody({ type: CreateIncidentDto })
  @ApiResponse({ status: 201, type: IncidentResponseDto })
  createIncident(@Body() body: CreateIncidentDto, @Request() req) {
    return this.securityService.createIncident(body as any, req.user.id);
  }

  @Get('incidents')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des incidents' })
  @ApiQuery({ name: 'severity', required: false, enum: ['LEGER', 'GRAVE', 'FATAL'] })
  @ApiQuery({ name: 'status', required: false, enum: ['OUVERT', 'EN_COURS', 'FERME'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Liste paginée des incidents' })
  findAll(@Query() query: any) {
    return this.securityService.findAll(query);
  }

  @Get('map')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({
    summary: 'Données carte incidents',
    description: 'Retourne uniquement les incidents géolocalisés pour IncidentMap.tsx',
  })
  @ApiResponse({ status: 200, type: [IncidentResponseDto] })
  getMapData() {
    return this.securityService.getMapData();
  }
}
