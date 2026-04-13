import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Notifications d'un citoyen (Notifications.tsx)
  // Agrège les messages agents + statuts des événements vitaux
  async getForUser(userId: string, role: string) {
    if (role !== 'CITIZEN') {
      // Pour les agents/admins : messages reçus
      const messages = await this.prisma.agentMessage.findMany({
        where: { agentId: userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      return messages.map((m) => ({
        id: m.id,
        type: 'MESSAGE',
        title: m.fromAdmin ? 'Message de l\'administration' : 'Message',
        content: m.content,
        read: !!m.readAt,
        createdAt: m.createdAt,
      }));
    }

    // Pour les citoyens : statuts des événements vitaux liés à leur NNI
    const citizen = await this.prisma.citizen.findUnique({ where: { id: userId } });
    if (!citizen) return [];

    const births = await this.prisma.birthRecord.findMany({
      where: { OR: [{ motherNni: citizen.nni }, { fatherNni: citizen.nni }] },
      orderBy: { createdAt: 'desc' }, take: 5,
    });

    return births.map((b) => ({
      id: b.id,
      type: 'VITAL_EVENT',
      title: `Acte de naissance — ${b.babyFirstName} ${b.babyLastName}`,
      content: `Statut : ${b.status}`,
      read: b.status !== 'EN_ATTENTE_VALIDATION',
      createdAt: b.createdAt,
    }));
  }

  async markRead(notificationId: string, userId: string) {
    // Marque un message agent comme lu
    await this.prisma.agentMessage.updateMany({
      where: { id: notificationId, agentId: userId },
      data: { readAt: new Date() },
    });
    return { success: true };
  }
}
