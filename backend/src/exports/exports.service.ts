import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type ExportTable = 'birth_records' | 'death_records' | 'marriage_records' | 'divorce_records' | 'migration_records' | 'citizens';

@Injectable()
export class ExportsService {
  constructor(private prisma: PrismaService) {}

  private getDelegate(table: ExportTable) {
    const map: Record<ExportTable, any> = {
      birth_records: this.prisma.birthRecord,
      death_records: this.prisma.deathRecord,
      marriage_records: this.prisma.marriageRecord,
      divorce_records: this.prisma.divorceRecord,
      migration_records: this.prisma.migrationRecord,
      citizens: this.prisma.citizen,
    };
    if (!map[table]) throw new BadRequestException('Table non autorisée');
    return map[table];
  }

  async exportData(params: { table: ExportTable; startDate?: string; endDate?: string }) {
    const where: any = {};
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }
    return this.getDelegate(params.table).findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  toCsv(data: any[]): string {
    if (!data?.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row).map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','),
    );
    return [headers, ...rows].join('\n');
  }

  // Stats globales pour AnalyticsPanel.tsx / Overview.tsx
  async getStats() {
    const [births, deaths, marriages, divorces, migrations, citizens] = await this.prisma.$transaction([
      this.prisma.birthRecord.count(),
      this.prisma.deathRecord.count(),
      this.prisma.marriageRecord.count(),
      this.prisma.divorceRecord.count(),
      this.prisma.migrationRecord.count(),
      this.prisma.citizen.count(),
    ]);

    return { births, deaths, marriages, divorces, migrations, citizens };
  }
}
