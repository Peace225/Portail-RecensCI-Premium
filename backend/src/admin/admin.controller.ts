import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('Administration & Audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ─── AUDIT LOGS ──────────────────────────────────────────────────────────

  @Get('audit')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Journal d\'audit — toutes les actions système' })
  @ApiQuery({ name: 'resource', required: false, description: 'Ex: BirthRecord, Citizen' })
  @ApiQuery({ name: 'action', required: false, enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'VALIDATE', 'REJECT'] })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  getAuditLogs(@Query() query: any) {
    return this.adminService.getAuditLogs(query);
  }

  // ─── API KEYS ─────────────────────────────────────────────────────────────

  @Post('api-keys')
  @Roles('SUPER_ADMIN')
  @ApiOperation({
    summary: 'Créer une clé API partenaire',
    description: 'La clé brute est retournée UNE SEULE FOIS. Conservez-la immédiatement.',
  })
  @ApiBody({
    schema: {
      example: {
        name: 'INS Côte d\'Ivoire',
        organizationName: 'Institut National de la Statistique',
        contactEmail: 'api@ins.ci',
        permissions: ['read:births', 'read:deaths', 'read:statistics'],
        rateLimit: 5000,
        expiresAt: '2027-12-31',
      },
    },
  })
  createApiKey(@Body() body: any, @Request() req) {
    return this.adminService.createApiKey(body, req.user.id);
  }

  @Get('api-keys')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Liste des clés API partenaires' })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'SUSPENDED', 'REVOKED', 'EXPIRED'] })
  @ApiQuery({ name: 'page', required: false })
  findApiKeys(@Query() query: any) {
    return this.adminService.findApiKeys(query);
  }

  @Get('api-keys/:id/stats')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Statistiques d\'utilisation d\'une clé API' })
  @ApiParam({ name: 'id' })
  getApiKeyStats(@Param('id') id: string) {
    return this.adminService.getApiKeyStats(id);
  }

  @Patch('api-keys/:id/revoke')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Révoquer une clé API' })
  @ApiParam({ name: 'id' })
  revokeApiKey(@Param('id') id: string) {
    return this.adminService.revokeApiKey(id);
  }
}
