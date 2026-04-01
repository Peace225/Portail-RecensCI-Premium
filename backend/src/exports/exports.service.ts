import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ExportsService {
  constructor(private supabase: SupabaseService) {}

  // Retourne les données brutes pour export CSV/JSON (DataExportModule.tsx)
  async exportData(params: {
    table: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'csv';
  }) {
    const allowedTables = [
      'birth_records', 'death_records', 'marriage_records',
      'divorce_records', 'migration_records', 'citizens',
    ];

    if (!allowedTables.includes(params.table)) {
      throw new Error('Table non autorisée pour l\'export');
    }

    let query = this.supabase.getClient().from(params.table).select('*');

    if (params.startDate) query = query.gte('created_at', params.startDate);
    if (params.endDate) query = query.lte('created_at', params.endDate);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    if (params.format === 'csv') {
      return this.toCsv(data);
    }
    return data;
  }

  private toCsv(data: any[]): string {
    if (!data?.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );
    return [headers, ...rows].join('\n');
  }

  // Stats globales pour AnalyticsPanel.tsx et Overview.tsx
  async getStats() {
    const tables = ['birth_records', 'death_records', 'marriage_records', 'citizens'];
    const counts = await Promise.all(
      tables.map(async (t) => {
        const { count } = await this.supabase
          .getClient()
          .from(t)
          .select('*', { count: 'exact', head: true });
        return { table: t, count };
      }),
    );
    return Object.fromEntries(counts.map((c) => [c.table, c.count]));
  }
}
