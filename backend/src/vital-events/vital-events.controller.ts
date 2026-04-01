import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { VitalEventsService, EventType } from './vital-events.service';

// Routes pour chaque type d'événement vital
const EVENT_TYPES: EventType[] = ['birth', 'death', 'marriage', 'divorce', 'migration'];

@ApiTags('Vital Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('events')
export class VitalEventsController {
  constructor(private vitalEventsService: VitalEventsService) {}

  // POST /v1/events/sync - Sync batch offline (depuis Redux-persist)
  @Post('sync')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN')
  syncBatch(@Body() body: { events: Array<{ type: EventType; data: any }> }, @Request() req) {
    return this.vitalEventsService.syncBatch(body.events, req.user.id);
  }

  // POST /v1/events/:type - Créer un événement (naissance, décès, mariage...)
  @Post(':type')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  create(@Param('type') type: EventType, @Body() body: any, @Request() req) {
    return this.vitalEventsService.create(type, body, req.user.id);
  }

  // GET /v1/events/:type - Liste des événements
  @Get(':type')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  findAll(@Param('type') type: EventType, @Query() query: any) {
    return this.vitalEventsService.findAll(type, query);
  }

  // PATCH /v1/events/:type/:id/status - Valider / Rejeter
  @Patch(':type/:id/status')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  updateStatus(
    @Param('type') type: EventType,
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req,
  ) {
    return this.vitalEventsService.updateStatus(type, id, status, req.user.id);
  }
}
