import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(institutionId?: string) {
    return this.prisma.user.findMany({
      where: {
        role: { in: ['AGENT', 'ENTITY_ADMIN'] },
        ...(institutionId ? { institutionId } : {}),
      },
      select: {
        id: true, fullName: true, email: true, role: true, createdAt: true,
        institution: { select: { name: true, type: true } },
      },
    });
  }

  async create(dto: { email: string; fullName: string; role: string; institutionId?: string; password?: string }) {
    const passwordHash = await bcrypt.hash(dto.password || 'Recensci@2024', 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        role: dto.role as any,
        institutionId: dto.institutionId,
        passwordHash,
      },
      select: { id: true, fullName: true, email: true, role: true },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Agent introuvable');
    await this.prisma.user.delete({ where: { id } });
    return { success: true };
  }

  async getMessages(agentId: string) {
    return this.prisma.agentMessage.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(agentId: string, content: string, fromAdmin = true) {
    return this.prisma.agentMessage.create({
      data: { agentId, content, fromAdmin },
    });
  }
}
