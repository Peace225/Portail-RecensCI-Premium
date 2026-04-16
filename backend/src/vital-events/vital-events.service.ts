import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStatus } from '@prisma/client';

export type EventType = 'birth' | 'death' | 'marriage' | 'divorce' | 'migration';

@Injectable()
export class VitalEventsService {
  constructor(private prisma: PrismaService) {}

  private getDelegate(type: EventType) {
    const map = {
      birth: this.prisma.birthRecord,
      death: this.prisma.deathRecord,
      marriage: this.prisma.marriageRecord,
      divorce: this.prisma.divorceRecord,
      migration: this.prisma.migrationRecord,
    };
    const delegate = map[type];
    if (!delegate) throw new BadRequestException(`Type d'événement invalide: ${type}`);
    return delegate as any;
  }

  async create(type: EventType, dto: any, agentId: string) {
    return this.getDelegate(type).create({
      data: { ...dto, agentId, status: EventStatus.EN_ATTENTE_VALIDATION },
    });
  }

  async findAll(type: EventType, filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as EventStatus } : {};

    const [data, total] = await this.prisma.$transaction([
      this.getDelegate(type).findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.getDelegate(type).count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async updateStatus(type: EventType, id: string, status: EventStatus, agentId: string) {
    return this.getDelegate(type).update({
      where: { id },
      data: { status, reviewedAt: new Date() },
    });
  }

  // Sync batch depuis le frontend offline (Redux-persist queue)
  async syncBatch(events: Array<{ type: EventType; data: any }>, agentId: string) {
    const results = await Promise.allSettled(
      events.map((e) => this.create(e.type, e.data, agentId)),
    );
    return results.map((r, i) => ({
      index: i,
      status: r.status,
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? (r.reason as Error)?.message : null,
    }));
  }
}
