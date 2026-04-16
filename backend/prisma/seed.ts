import { PrismaClient, Role, InstitutionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Institutions
  const mairie = await prisma.institution.upsert({
    where: { id: 'inst-mairie-abidjan' },
    update: {},
    create: { id: 'inst-mairie-abidjan', name: 'Mairie d\'Abidjan', type: InstitutionType.MAIRIE, city: 'Abidjan' },
  });

  const police = await prisma.institution.upsert({
    where: { id: 'inst-police-abidjan' },
    update: {},
    create: { id: 'inst-police-abidjan', name: 'Commissariat Central Abidjan', type: InstitutionType.POLICE, city: 'Abidjan' },
  });

  const hash = await bcrypt.hash('password123', 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@recensci.ci' },
    update: {},
    create: {
      email: 'superadmin@recensci.ci',
      passwordHash: hash,
      fullName: 'Super Administrateur',
      role: Role.SUPER_ADMIN,
    },
  });

  // Admin Mairie
  await prisma.user.upsert({
    where: { email: 'maire@recensci.ci' },
    update: {},
    create: {
      email: 'maire@recensci.ci',
      passwordHash: hash,
      fullName: 'Maire Abidjan',
      role: Role.ENTITY_ADMIN,
      institutionId: mairie.id,
    },
  });

  // Agent
  await prisma.user.upsert({
    where: { email: 'agent@recensci.ci' },
    update: {},
    create: {
      email: 'agent@recensci.ci',
      passwordHash: hash,
      fullName: 'Agent Koné',
      role: Role.AGENT,
      institutionId: mairie.id,
    },
  });

  // Citoyen test
  await prisma.citizen.upsert({
    where: { nni: 'CI-0001-2024' },
    update: {},
    create: {
      nni: 'CI-0001-2024',
      email: 'citoyen@recensci.ci',
      passwordHash: hash,
      fullName: 'Kouassi Jean',
      city: 'Abidjan',
      status: 'VALIDE',
    },
  });

  console.log('Seed termine');
  console.log('   superadmin@recensci.ci / password123');
  console.log('   maire@recensci.ci      / password123');
  console.log('   agent@recensci.ci      / password123');
  console.log('   citoyen@recensci.ci    / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
