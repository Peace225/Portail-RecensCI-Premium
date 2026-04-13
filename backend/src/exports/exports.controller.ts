import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth, ApiTags, ApiOperation, ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
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

  @Get('stats')
  @Roles('AGENT', 'ADMIN', 'SUPER_ADMIN', 'ENTITY_ADMIN')
  @ApiOperation({
    summary: 'Statistiques globales',
    description: 'Utilisé par AnalyticsPanel.tsx et Overview.tsx',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        births: 1240,
        deaths: 320,
        marriages: 580,
        divorces: 45,
        migrations: 210,
        citizens: 15000,
      },
    },
  })
  getStats() {
    return this.exportsService.getStats();
  }

  @Get('data')
  @Roles('ADMIN', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Export de données',
    description: 'Retourne JSON ou CSV selon le paramètre format. Utilisé par DataExportModule.tsx',
  })
  @ApiQuery({
    name: 'table',
    enum: ['birth_records', 'death_records', 'marriage_records', 'divorce_records', 'migration_records', 'citizens'],
  })
  @ApiQuery({ name: 'startDate', required: false, example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', required: false, example: '2024-12-31' })
  @ApiQuery({ name: 'format', required: false, enum: ['json', 'csv'], description: 'Défaut: json' })
  @ApiResponse({ status: 200, description: 'Données JSON ou fichier CSV en téléchargement' })
  async exportData(@Query() query: any, @Res() res: Response) {
    const data = await this.exportsService.exportData(query);

    if (query.format === 'csv') {
      const csv = this.exportsService.toCsv(data as any[]);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${query.table}.csv"`);
      return res.send(csv);
    }

    return res.json(data);
  }
}
