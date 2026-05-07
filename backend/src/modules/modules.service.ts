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

  // ─── CHANGEMENT DE RÉSIDENCE ──────────────────────────────────────────────

  async createResidenceChange(dto: any) {
    return this.prisma.residenceChangeRequest.create({
      data: {
        ...dto,
        effectDate: new Date(dto.effectDate),
        moveDate: new Date(dto.moveDate),
        status: 'EN_ATTENTE_VALIDATION',
      },
    });
  }

  async findResidenceChanges(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.residenceChangeRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.residenceChangeRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── CASIER JUDICIAIRE ────────────────────────────────────────────────────

  async createCasierJudiciaire(dto: any) {
    const ref = `CJ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return this.prisma.casierJudiciaire.create({
      data: { ...dto, referenceNumber: ref, status: 'EN_ATTENTE_VALIDATION' },
    });
  }

  async findCasierJudiciaire(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.casierJudiciaire.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.casierJudiciaire.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── CNI / PASSEPORT ─────────────────────────────────────────────────────

  async createCniPasseport(dto: any) {
    const ref = `CNI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return this.prisma.cniPasseportRequest.create({
      data: { ...dto, referenceNumber: ref, status: 'EN_ATTENTE_VALIDATION' },
    });
  }

  async findCniPasseport(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.cniPasseportRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.cniPasseportRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── IMPÔTS ───────────────────────────────────────────────────────────────

  async createImpotsRequest(dto: any) {
    return this.prisma.impotsRequest.create({
      data: { ...dto, status: 'EN_ATTENTE' },
    });
  }

  async findImpotsRequests(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.impotsRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.impotsRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── BLOQUER CNI ──────────────────────────────────────────────────────────

  async createCniBlock(dto: any) {
    const ref = `BLOCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    return this.prisma.cniBlockRequest.create({
      data: {
        ...dto,
        incidentDate: new Date(dto.incidentDate),
        referenceNumber: ref,
        status: 'EN_ATTENTE_VALIDATION',
      },
    });
  }

  async findCniBlocks(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.cniBlockRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.cniBlockRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── RECENSEMENT MÉNAGE ───────────────────────────────────────────────────

  async createCensus(dto: any) {
    return this.prisma.censusRecord.create({
      data: {
        citizenId: dto.citizenId,
        citizenNni: dto.citizenNni,
        address: dto.residence?.address,
        quartier: dto.residence?.quartier,
        commune: dto.residence?.commune,
        city: dto.residence?.city,
        phone: dto.residence?.phone,
        housingType: dto.residence?.housingType,
        ownership: dto.residence?.ownership,
        householdSize: dto.householdSize || (dto.members?.length ?? 1),
        members: dto.members ?? [],
        status: 'SOUMIS',
      },
    });
  }

  async findCensus(filters: { commune?: string; city?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.commune) where.commune = { contains: filters.commune, mode: 'insensitive' };
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.censusRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.censusRecord.count({ where }),
    ]);
    return { data, total, page, limit };
  }
}
