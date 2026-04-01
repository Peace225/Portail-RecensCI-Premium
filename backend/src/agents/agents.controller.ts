import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiQuery, ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AgentsService } from './agents.service';
import { CreateAgentDto, SendMessageDto, AgentResponseDto } from './dto/agent.dto';

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Liste des agents', description: 'ENTITY_ADMIN ne voit que les agents de son institution' })
  @ApiQuery({ name: 'institutionId', required: false, description: 'Filtrer par institution (ADMIN/SUPER_ADMIN seulement)' })
  @ApiResponse({ status: 200, type: [AgentResponseDto] })
  findAll(@Query('institutionId') institutionId: string, @Request() req) {
    const id = req.user.role === 'ENTITY_ADMIN' ? req.user.institutionId : institutionId;
    return this.agentsService.findAll(id);
  }

  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Créer un agent', description: 'Mot de passe par défaut: Recensci@2024' })
  @ApiBody({ type: CreateAgentDto })
  @ApiResponse({ status: 201, type: AgentResponseDto })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Body() body: CreateAgentDto) {
    return this.agentsService.create(body);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Supprimer un agent' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiResponse({ status: 200, schema: { example: { success: true } } })
  @ApiResponse({ status: 404, description: 'Agent introuvable' })
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  @Get(':id/messages')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Messages d\'un agent' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiResponse({ status: 200, description: 'Liste des messages' })
  getMessages(@Param('id') id: string) {
    return this.agentsService.getMessages(id);
  }

  @Post(':id/messages')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({ summary: 'Envoyer un message à un agent' })
  @ApiParam({ name: 'id', description: 'UUID de l\'agent' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 201, description: 'Message envoyé' })
  sendMessage(@Param('id') id: string, @Body() body: SendMessageDto) {
    return this.agentsService.sendMessage(id, body.content);
  }
}
