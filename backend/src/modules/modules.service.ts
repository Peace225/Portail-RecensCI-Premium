import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  // ─── MARIAGE COUTUMIER ───────────────────────────────────────────────────

  async createCustomaryMarriage(dto: any, agentId: string) {
    return this.prisma.customaryMarriageRecord.create({
      data: { ...dto, agentId, status: 'EN_ATTENTE_VALIDATION' },
    });
  }

  async findCustomaryMarriages(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.customaryMarriageRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.customaryMarriageRecord.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── NAISSANCE HORS ÉTABLISSEMENT ────────────────────────────────────────

  async createOutOfFacilityBirth(dto: any, agentId: string) {
    return this.prisma.outOfFacilityBirthRecord.create({
      data: { ...dto, agentId, status: 'EN_ATTENTE_VALIDATION' },
    });
  }

  async findOutOfFacilityBirths(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.outOfFacilityBirthRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.outOfFacilityBirthRecord.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── CERTIFICATS ─────────────────────────────────────────────────────────

  async createCertificateRequest(dto: any) {
    const refNumber = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return this.prisma.certificateRequest.create({
      data: { ...dto, referenceNumber: refNumber, status: 'EN_ATTENTE' },
    });
  }

  async findCertificates(filters: { status?: string; type?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.certificateRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.certificateRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async updateCertificateStatus(id: string, status: string, processedBy: string) {
    return this.prisma.certificateRequest.update({
      where: { id },
      data: {
        status: status as any,
        processedBy,
        ...(status === 'DELIVRE' ? { deliveredAt: new Date() } : {}),
      },
    });
  }

  async getCertificateByRef(ref: string) {
    const cert = await this.prisma.certificateRequest.findUnique({ where: { referenceNumber: ref } });
    if (!cert) throw new NotFoundException('Certificat introuvable');
    return cert;
  }

  // ─── ALERTES SANITAIRES ───────────────────────────────────────────────────

  async createHealthAlert(dto: any, reportedBy: string) {
    return this.prisma.healthAlert.create({
      data: { ...dto, reportedBy, status: 'ACTIVE' },
    });
  }

  async findHealthAlerts(filters: { severity?: string; status?: string; region?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.severity) where.severity = filters.severity;
    if (filters.status) where.status = filters.status;
    if (filters.region) where.region = { contains: filters.region, mode: 'insensitive' };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.healthAlert.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.healthAlert.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async resolveHealthAlert(id: string) {
    return this.prisma.healthAlert.update({
      where: { id },
      data: { status: 'RESOLUE', resolvedAt: new Date() },
    });
  }

  // ─── SUPPORT TICKETS ─────────────────────────────────────────────────────

  async createTicket(dto: any, submittedBy: string) {
    return this.prisma.supportTicket.create({
      data: { ...dto, submittedBy, status: 'OUVERT' },
    });
  }

  async findTickets(filters: { status?: string; priority?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.supportTicket.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.supportTicket.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async updateTicket(id: string, dto: { status?: string; assignedTo?: string }) {
    return this.prisma.supportTicket.update({
      where: { id },
      data: {
        ...dto,
        status: dto.status as any,
        ...(dto.status === 'RESOLU' ? { resolvedAt: new Date() } : {}),
      },
    });
  }
}
