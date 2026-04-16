import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Severity, IncidentStatus } from '@prisma/client';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async createIncident(dto: {
    type: string;
    severity: Severity;
    location: string;
    latitude?: number;
    longitude?: number;
    description: string;
    judicialFollowup?: boolean;
  }, reportedById: string) {
    return this.prisma.securityIncident.create({
      data: { ...dto, reportedById },
    });
  }

  async findAll(filters: { severity?: Severity; status?: IncidentStatus; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.severity) where.severity = filters.severity;
    if (filters.status) where.status = filters.status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.securityIncident.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.securityIncident.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // Données carte (IncidentMap.tsx)
  async getMapData() {
    return this.prisma.securityIncident.findMany({
      where: { latitude: { not: null } },
      select: { id: true, type: true, severity: true, latitude: true, longitude: true, status: true, createdAt: true },
    });
  }

  // Urgence citoyen (CitizenEmergency.tsx)
  async createEmergency(dto: {
    type: string;
    description: string;
    latitude?: number;
    longitude?: number;
    location: string;
  }, reportedById: string) {
    return this.prisma.securityIncident.create({
      data: {
        type: `URGENCE_CITOYEN: ${dto.type}`,
        severity: 'GRAVE',
        location: dto.location,
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        judicialFollowup: false,
        reportedById,
      },
    });
  }
}
