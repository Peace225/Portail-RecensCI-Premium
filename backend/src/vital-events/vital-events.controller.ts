import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiQuery, ApiBody, ApiExtraModels,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { VitalEventsService, EventType } from './vital-events.service';
import {
  CreateBirthDto, CreateDeathDto, CreateMarriageDto,
  CreateDivorceDto, CreateMigrationDto, SyncBatchDto, UpdateStatusDto,
} from './dto/vital-events.dto';

@ApiTags('Vital Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiExtraModels(CreateBirthDto, CreateDeathDto, CreateMarriageDto, CreateDivorceDto, CreateMigrationDto)
@Controller('events')
export class VitalEventsController {
  constructor(private vitalEventsService: VitalEventsService) {}

  @Post('sync')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Sync batch offline',
    description: 'Synchronise la queue d\'événements stockée localement (Redux-persist) quand la connexion revient',
  })
  @ApiBody({ type: SyncBatchDto })
  @ApiResponse({ status: 201, description: 'Résultats de la synchronisation par index' })
  syncBatch(@Body() body: SyncBatchDto, @Request() req) {
    return this.vitalEventsService.syncBatch(body.events as any, req.user.id);
  }

  @Post('birth')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Déclarer une naissance' })
  @ApiBody({ type: CreateBirthDto })
  @ApiResponse({ status: 201, description: 'Acte de naissance créé' })
  createBirth(@Body() body: CreateBirthDto, @Request() req) {
    return this.vitalEventsService.create('birth', body, req.user.id);
  }

  @Post('death')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Déclarer un décès' })
  @ApiBody({ type: CreateDeathDto })
  @ApiResponse({ status: 201, description: 'Acte de décès créé' })
  createDeath(@Body() body: CreateDeathDto, @Request() req) {
    return this.vitalEventsService.create('death', body, req.user.id);
  }

  @Post('marriage')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Enregistrer un mariage' })
  @ApiBody({ type: CreateMarriageDto })
  @ApiResponse({ status: 201, description: 'Acte de mariage créé' })
  createMarriage(@Body() body: CreateMarriageDto, @Request() req) {
    return this.vitalEventsService.create('marriage', body, req.user.id);
  }

  @Post('divorce')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Enregistrer un divorce' })
  @ApiBody({ type: CreateDivorceDto })
  @ApiResponse({ status: 201, description: 'Acte de divorce créé' })
  createDivorce(@Body() body: CreateDivorceDto, @Request() req) {
    return this.vitalEventsService.create('divorce', body, req.user.id);
  }

  @Post('migration')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Enregistrer une migration' })
  @ApiBody({ type: CreateMigrationDto })
  @ApiResponse({ status: 201, description: 'Acte de migration créé' })
  createMigration(@Body() body: CreateMigrationDto, @Request() req) {
    return this.vitalEventsService.create('migration', body, req.user.id);
  }

  @Get(':type')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des événements par type' })
  @ApiParam({ name: 'type', enum: ['birth', 'death', 'marriage', 'divorce', 'migration'] })
  @ApiQuery({ name: 'status', required: false, enum: ['EN_ATTENTE_VALIDATION', 'VALIDE', 'REJETE'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Liste paginée des événements' })
  findAll(@Param('type') type: EventType, @Query() query: any) {
    return this.vitalEventsService.findAll(type, query);
  }

  @Patch(':type/:id/status')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Valider ou rejeter un événement' })
  @ApiParam({ name: 'type', enum: ['birth', 'death', 'marriage', 'divorce', 'migration'] })
  @ApiParam({ name: 'id', description: 'UUID de l\'événement' })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  updateStatus(
    @Param('type') type: EventType,
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
    @Request() req,
  ) {
    return this.vitalEventsService.updateStatus(type, id, body.status as any, req.user.id);
  }
}
