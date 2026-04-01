import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AgentsService } from './agents.service';

@ApiTags('Agents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  // GET /v1/agents - Liste des agents (backoffice AgentList.tsx)
  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  findAll(@Query('institutionId') institutionId: string, @Request() req) {
    // ENTITY_ADMIN ne voit que ses agents
    const id = req.user.role === 'ENTITY_ADMIN' ? req.user.institutionId : institutionId;
    return this.agentsService.findAll(id);
  }

  // POST /v1/agents - Ajouter un agent (backoffice AddAgent.tsx)
  @Post()
  @Roles('ADMIN', 'SUPER_ADMIN')
  create(@Body() body: any) {
    return this.agentsService.create(body);
  }

  // DELETE /v1/agents/:id
  @Delete(':id')
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }

  // GET /v1/agents/:id/messages - Messages d'un agent (AgentMessages.tsx)
  @Get(':id/messages')
  @Roles('ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  getMessages(@Param('id') id: string) {
    return this.agentsService.getMessages(id);
  }
}
