import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ModulesService } from './modules.service';

@ApiTags('Modules Spéciaux')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  // ─── MARIAGE COUTUMIER ───────────────────────────────────────────────────

  @Post('customary-marriage')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Enregistrer un mariage coutumier' })
  createCustomaryMarriage(@Body() body: any, @Request() req) {
    return this.modulesService.createCustomaryMarriage(body, req.user.id);
  }

  @Get('customary-marriage')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des mariages coutumiers' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findCustomaryMarriages(@Query() query: any) {
    return this.modulesService.findCustomaryMarriages(query);
  }

  // ─── NAISSANCE HORS ÉTABLISSEMENT ────────────────────────────────────────

  @Post('out-of-facility-birth')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Enregistrer une naissance hors établissement' })
  createOutOfFacilityBirth(@Body() body: any, @Request() req) {
    return this.modulesService.createOutOfFacilityBirth(body, req.user.id);
  }

  @Get('out-of-facility-birth')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des naissances hors établissement' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false })
  findOutOfFacilityBirths(@Query() query: any) {
    return this.modulesService.findOutOfFacilityBirths(query);
  }

  // ─── CERTIFICATS ─────────────────────────────────────────────────────────

  @Post('certificates')
  @Roles('CITIZEN', 'AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Demander un certificat / document officiel' })
  @ApiBody({ schema: { example: { citizenName: 'Kouassi Jean', citizenNni: 'CI-0001-2024', type: 'EXTRAIT_NAISSANCE', purpose: 'Inscription scolaire' } } })
  createCertificate(@Body() body: any) {
    return this.modulesService.createCertificateRequest(body);
  }

  @Get('certificates')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des demandes de certificats' })
  @ApiQuery({ name: 'status', required: false, enum: ['EN_ATTENTE', 'EN_TRAITEMENT', 'PRET', 'DELIVRE', 'REJETE'] })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false })
  findCertificates(@Query() query: any) {
    return this.modulesService.findCertificates(query);
  }

  @Get('certificates/track/:ref')
  @Roles('CITIZEN', 'AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Suivre une demande par numéro de référence' })
  @ApiParam({ name: 'ref', example: 'CERT-1234567890-123' })
  trackCertificate(@Param('ref') ref: string) {
    return this.modulesService.getCertificateByRef(ref);
  }

  @Patch('certificates/:id/status')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un certificat' })
  @ApiParam({ name: 'id' })
  @ApiBody({ schema: { example: { status: 'DELIVRE' } } })
  updateCertificate(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.modulesService.updateCertificateStatus(id, status, req.user.id);
  }

  // ─── ALERTES SANITAIRES ───────────────────────────────────────────────────

  @Post('health-alerts')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Déclarer une alerte sanitaire' })
  @ApiBody({ schema: { example: { title: 'Épidémie de choléra', type: 'Épidémie', severity: 'ELEVE', region: 'Abidjan', description: '...', affectedCount: 45 } } })
  createHealthAlert(@Body() body: any, @Request() req) {
    return this.modulesService.createHealthAlert(body, req.user.id);
  }

  @Get('health-alerts')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des alertes sanitaires' })
  @ApiQuery({ name: 'severity', required: false, enum: ['FAIBLE', 'MODERE', 'ELEVE', 'CRITIQUE'] })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'SURVEILLEE', 'RESOLUE'] })
  @ApiQuery({ name: 'region', required: false })
  @ApiQuery({ name: 'page', required: false })
  findHealthAlerts(@Query() query: any) {
    return this.modulesService.findHealthAlerts(query);
  }

  @Patch('health-alerts/:id/resolve')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Résoudre une alerte sanitaire' })
  @ApiParam({ name: 'id' })
  resolveHealthAlert(@Param('id') id: string) {
    return this.modulesService.resolveHealthAlert(id);
  }

  // ─── SUPPORT TICKETS ─────────────────────────────────────────────────────

  @Post('support')
  @Roles('CITIZEN', 'AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Créer un ticket de support' })
  @ApiBody({ schema: { example: { subject: 'Erreur sur acte de naissance', category: 'Acte civil', description: '...', priority: 'HAUTE' } } })
  createTicket(@Body() body: any, @Request() req) {
    return this.modulesService.createTicket(body, req.user.id);
  }

  @Get('support')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Liste des tickets de support' })
  @ApiQuery({ name: 'status', required: false, enum: ['OUVERT', 'EN_COURS', 'RESOLU', 'FERME'] })
  @ApiQuery({ name: 'priority', required: false, enum: ['FAIBLE', 'NORMALE', 'HAUTE', 'URGENTE'] })
  @ApiQuery({ name: 'page', required: false })
  findTickets(@Query() query: any) {
    return this.modulesService.findTickets(query);
  }

  @Patch('support/:id')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un ticket' })
  @ApiParam({ name: 'id' })
  updateTicket(@Param('id') id: string, @Body() body: any) {
    return this.modulesService.updateTicket(id, body);
  }
}
