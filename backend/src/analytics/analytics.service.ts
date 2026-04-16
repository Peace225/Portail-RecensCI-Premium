import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Dashboard principal (Overview.tsx + AnalyticsPanel.tsx)
  async getDashboard() {
    const [
      totalCitizens, pendingCitizens, validatedCitizens, suspectCitizens,
      totalBirths, totalDeaths, totalMarriages, totalDivorces, totalMigrations,
      totalAgents, totalIncidents,
    ] = await this.prisma.$transaction([
      this.prisma.citizen.count(),
      this.prisma.citizen.count({ where: { status: 'EN_ATTENTE_VALIDATION' } }),
      this.prisma.citizen.count({ where: { status: 'VALIDE' } }),
      this.prisma.citizen.count({ where: { status: 'SUSPECT' } }),
      this.prisma.birthRecord.count(),
      this.prisma.deathRecord.count(),
      this.prisma.marriageRecord.count(),
      this.prisma.divorceRecord.count(),
      this.prisma.migrationRecord.count(),
      this.prisma.user.count({ where: { role: { in: ['AGENT', 'ENTITY_ADMIN'] } } }),
      this.prisma.securityIncident.count(),
    ]);

    return {
      citizens: { total: totalCitizens, pending: pendingCitizens, validated: validatedCitizens, suspect: suspectCitizens },
      vitalEvents: { births: totalBirths, deaths: totalDeaths, marriages: totalMarriages, divorces: totalDivorces, migrations: totalMigrations },
      agents: totalAgents,
      incidents: totalIncidents,
    };
  }

  // Historique mensuel des naissances/décès (Overview chart)
  async getMonthlyTrend() {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString('fr-FR', { month: 'short' }) };
    });

    const trends = await Promise.all(
      months.map(async ({ year, month, label }) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        const [births, deaths] = await this.prisma.$transaction([
          this.prisma.birthRecord.count({ where: { createdAt: { gte: start, lte: end } } }),
          this.prisma.deathRecord.count({ where: { createdAt: { gte: start, lte: end } } }),
        ]);
        return { date: label, naissances: births, deces: deaths };
      }),
    );

    return trends;
  }

  // Stats Mairie (MairieDashboard.tsx)
  async getMairieStats(institutionId?: string) {
    const [births, marriages, divorces, pendingEvents] = await this.prisma.$transaction([
      this.prisma.birthRecord.count(),
      this.prisma.marriageRecord.count(),
      this.prisma.divorceRecord.count(),
      this.prisma.birthRecord.count({ where: { status: 'EN_ATTENTE_VALIDATION' } }),
    ]);
    return { births, marriages, divorces, pendingEvents, revenue: 0 };
  }

  // Stats Police (PoliceDashboard.tsx)
  async getPoliceStats(institutionId?: string) {
    const [openIncidents, graveIncidents, fatalIncidents, closedIncidents] = await this.prisma.$transaction([
      this.prisma.securityIncident.count({ where: { status: 'OUVERT' } }),
      this.prisma.securityIncident.count({ where: { severity: 'GRAVE' } }),
      this.prisma.securityIncident.count({ where: { severity: 'FATAL' } }),
      this.prisma.securityIncident.count({ where: { status: 'FERME' } }),
    ]);
    return { openIncidents, graveIncidents, fatalIncidents, closedIncidents, deployments: 0 };
  }
}
