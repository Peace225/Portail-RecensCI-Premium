import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Notifications de l\'utilisateur connecté', description: 'Utilisé par Notifications.tsx' })
  getMyNotifications(@Request() req) {
    return this.notificationsService.getForUser(req.user.id, req.user.role);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiParam({ name: 'id' })
  markRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markRead(id, req.user.id);
  }
}
