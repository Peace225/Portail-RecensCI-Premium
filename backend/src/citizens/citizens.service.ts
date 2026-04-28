import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitizensService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any) {
    const nni = dto.nni || `CI-${Date.now()}`;
    return this.prisma.citizen.create({
      data: {
        nni,
        fullName: dto.fullName || `${dto.firstName || ''} ${dto.lastName || ''}`.trim(),
        email: dto.email || null,
        city: dto.city || null,
        address: dto.address || null,
        phone: dto.phone || null,
        gender: dto.gender || null,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      },
    });
  }

  async findAll(filters: { search?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where = filters.search
      ? { OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' as const } },
          { nni: { contains: filters.search, mode: 'insensitive' as const } },
        ]}
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.citizen.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.citizen.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const citizen = await this.prisma.citizen.findUnique({ where: { id } });
    if (!citizen) throw new NotFoundException('Citoyen introuvable');
    return citizen;
  }

  async findByNni(nni: string) {
    const citizen = await this.prisma.citizen.findUnique({ where: { nni } });
    if (!citizen) throw new NotFoundException('Citoyen introuvable');
    return citizen;
  }

  // Dossiers en attente de validation (CitizenFlux.tsx)
  async findPending(filters: { page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = { status: 'EN_ATTENTE_VALIDATION' };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.citizen.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.citizen.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // Dossiers suspects / anomalies (CitizenValidation.tsx)
  async findFlagged(filters: { page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = { status: 'SUSPECT' };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.citizen.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.citizen.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async update(id: string, dto: any) {
    return this.prisma.citizen.update({ where: { id }, data: dto });
  }

  async validate(id: string) {
    return this.prisma.citizen.update({
      where: { id },
      data: { status: 'VALIDE', validatedAt: new Date() },
    });
  }

  // Approuver depuis CitizenFlux
  async approve(id: string) {
    return this.validate(id);
  }

  // Marquer comme suspect (CitizenValidation)
  async investigate(id: string) {
    return this.prisma.citizen.update({
      where: { id },
      data: { status: 'SUSPECT' },
    });
  }

  // Changer l'adresse (AddressChange.tsx)
  async updateAddress(id: string, dto: { address: string; city: string }) {
    return this.prisma.citizen.update({
      where: { id },
      data: { address: dto.address, city: dto.city },
    });
  }

  // Profil complet + données ménage simulées (CitizenProfile.tsx)
  async getProfile(id: string) {
    const citizen = await this.findOne(id);
    // Les données ménage seront étendues quand la table household sera créée
    return { ...citizen, household: [] };
  }

  // Demandes de documents (CitizenRequests.tsx)
  async getRequests(id: string) {
    // Agrège les événements vitaux liés à ce citoyen comme "demandes"
    const [births, deaths, marriages] = await this.prisma.$transaction([
      this.prisma.birthRecord.findMany({
        where: { OR: [{ motherNni: { not: null } }, { fatherNni: { not: null } }] },
        take: 10, orderBy: { createdAt: 'desc' },
      }),
      this.prisma.deathRecord.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
      this.prisma.marriageRecord.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
    ]);
    return { births, deaths, marriages };
  }

  // Créer une demande de document
  async createRequest(id: string, dto: { type: string; description?: string }) {
    // Stocké comme un événement en attente — extensible avec une table dédiée
    return { id: `REQ-${Date.now()}`, citizenId: id, ...dto, status: 'EN_ATTENTE', createdAt: new Date() };
  }

  // Prestations sociales (SocialSecurityView.tsx)
  async getSocialBenefits(id: string) {
    // Données calculées — extensible avec une table social_benefits
    return {
      citizenId: id,
      pension: { amount: 0, status: 'NON_ELIGIBLE' },
      scholarship: { amount: 0, status: 'NON_ELIGIBLE' },
      healthCoverage: { status: 'NON_INSCRIT' },
    };
  }
}
