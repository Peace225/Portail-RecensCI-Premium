import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ExportsService } from './exports.service';

@ApiTags('Exports & Stats')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportsController {
  constructor(private exportsService: ExportsService) {}

  // GET /v1/exports/stats - Statistiques globales (AnalyticsPanel, Overview)
  @Get('stats')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  getStats() {
    return this.exportsService.getStats();
  }

  // GET /v1/exports/data?table=birth_records&format=csv - Export (DataExportModule.tsx)
  @Get('data')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async exportData(@Query() query: any, @Res() res: Response) {
    const result = await this.exportsService.exportData(query);

    if (query.format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${query.table}.csv"`);
      return res.send(result);
    }

    return res.json(result);
  }
}
