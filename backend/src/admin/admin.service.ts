import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ─── AUDIT LOGS ──────────────────────────────────────────────────────────

  async logAction(dto: {
    userId?: string;
    userEmail?: string;
    userRole?: string;
    action: string;
    resource: string;
    resourceId?: string;
    description?: string;
    ipAddress?: string;
    metadata?: any;
  }) {
    return this.prisma.auditLog.create({ data: dto as any });
  }

  async getAuditLogs(filters: {
    userId?: string;
    resource?: string;
    action?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 50;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.resource) where.resource = filters.resource;
    if (filters.action) where.action = filters.action;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  // ─── API KEYS ─────────────────────────────────────────────────────────────

  async createApiKey(dto: {
    name: string;
    organizationName?: string;
    contactEmail?: string;
    permissions?: string[];
    rateLimit?: number;
    expiresAt?: string;
  }, createdBy: string) {
    // Générer une clé sécurisée
    const rawKey = `rci_live_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 16) + '...';

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyHash,
        keyPrefix,
        organizationName: dto.organizationName,
        contactEmail: dto.contactEmail,
        permissions: dto.permissions || [],
        rateLimit: dto.rateLimit || 1000,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        createdBy,
      },
    });

    // On retourne la clé brute UNE SEULE FOIS — elle ne sera plus jamais visible
    return { ...apiKey, rawKey, keyHash: undefined };
  }

  async findApiKeys(filters: { status?: string; page?: number; limit?: number }) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const skip = (page - 1) * limit;
    const where = filters.status ? { status: filters.status as any } : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.apiKey.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, keyPrefix: true, organizationName: true,
          contactEmail: true, permissions: true, rateLimit: true,
          status: true, expiresAt: true, lastUsedAt: true, createdAt: true,
        },
      }),
      this.prisma.apiKey.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async revokeApiKey(id: string) {
    return this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
  }

  async getApiKeyStats(id: string) {
    const [key, usageCount, recentLogs] = await this.prisma.$transaction([
      this.prisma.apiKey.findUnique({
        where: { id },
        select: { id: true, name: true, keyPrefix: true, status: true, rateLimit: true, lastUsedAt: true },
      }),
      this.prisma.apiKeyUsageLog.count({ where: { apiKeyId: id } }),
      this.prisma.apiKeyUsageLog.findMany({
        where: { apiKeyId: id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);
    return { key, totalRequests: usageCount, recentLogs };
  }
}
