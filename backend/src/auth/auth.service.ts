import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Cherche d'abord dans les users (agents/admins)
    const user = await this.prisma.user.findUnique({ where: { email }, include: { institution: true } });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return this.buildToken({ id: user.id, role: user.role, name: user.fullName, institutionId: user.institutionId });
    }

    // Fallback : citoyen
    const citizen = await this.prisma.citizen.findUnique({ where: { email } });
    if (citizen && citizen.passwordHash && await bcrypt.compare(password, citizen.passwordHash)) {
      return this.buildToken({ id: citizen.id, role: 'CITIZEN', name: citizen.fullName });
    }

    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  private buildToken(payload: { id: string; role: string; name: string; institutionId?: string }) {
    return {
      access_token: this.jwt.sign(payload),
      user: payload,
    };
  }

  async getMe(userId: string, role: string) {
    if (role === 'CITIZEN') {
      return this.prisma.citizen.findUnique({
        where: { id: userId },
        select: { id: true, nni: true, fullName: true, email: true, city: true, status: true },
      });
    }
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, role: true, institution: { select: { name: true, type: true } } },
    });
  }
}
