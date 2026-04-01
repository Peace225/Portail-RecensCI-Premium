import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitizensService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { search?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const where = filters.search
      ? {
          OR: [
            { fullName: { contains: filters.search, mode: 'insensitive' as const } },
            { nni: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
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

  async update(id: string, dto: any) {
    return this.prisma.citizen.update({ where: { id }, data: dto });
  }

  async validate(id: string) {
    return this.prisma.citizen.update({
      where: { id },
      data: { status: 'VALIDE', validatedAt: new Date() },
    });
  }
}
