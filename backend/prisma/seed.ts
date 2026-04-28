import { PrismaClient, Role, InstitutionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Les 10 communes principales d'Abidjan + 4 périphériques
const COMMUNES_ABIDJAN = [
  { id: 'inst-cocody', name: 'Mairie de Cocody', city: 'Abidjan - Cocody' },
  { id: 'inst-plateau', name: 'Mairie du Plateau', city: 'Abidjan - Plateau' },
  { id: 'inst-yopougon', name: 'Mairie de Yopougon', city: 'Abidjan - Yopougon' },
  { id: 'inst-abobo', name: 'Mairie d\'Abobo', city: 'Abidjan - Abobo' },
  { id: 'inst-adjame', name: 'Mairie d\'Adjamé', city: 'Abidjan - Adjamé' },
  { id: 'inst-marcory', name: 'Mairie de Marcory', city: 'Abidjan - Marcory' },
  { id: 'inst-treichville', name: 'Mairie de Treichville', city: 'Abidjan - Treichville' },
  { id: 'inst-koumassi', name: 'Mairie de Koumassi', city: 'Abidjan - Koumassi' },
  { id: 'inst-portbouet', name: 'Mairie de Port-Bouët', city: 'Abidjan - Port-Bouët' },
  { id: 'inst-attiecoube', name: 'Mairie d\'Attécoubé', city: 'Abidjan - Attécoubé' },
  // 4 communes périphériques
  { id: 'inst-bingerville', name: 'Mairie de Bingerville', city: 'Abidjan - Bingerville' },
  { id: 'inst-anyama', name: 'Mairie d\'Anyama', city: 'Abidjan - Anyama' },
  { id: 'inst-songon', name: 'Mairie de Songon', city: 'Abidjan - Songon' },
  { id: 'inst-dabou', name: 'Mairie de Dabou', city: 'Grand-Lahou' },
];

const COMMISSARIATS = [
  { id: 'inst-police-cocody', name: 'Commissariat de Cocody', city: 'Abidjan - Cocody' },
  { id: 'inst-police-yopougon', name: 'Commissariat de Yopougon', city: 'Abidjan - Yopougon' },
  { id: 'inst-police-abobo', name: 'Commissariat d\'Abobo', city: 'Abidjan - Abobo' },
  { id: 'inst-police-plateau', name: 'Direction Centrale Police Judiciaire', city: 'Abidjan - Plateau' },
];

async function main() {
  console.log('Seeding database...');

  // Créer toutes les communes
  for (const commune of COMMUNES_ABIDJAN) {
    await prisma.institution.upsert({
      where: { id: commune.id },
      update: {},
      create: { id: commune.id, name: commune.name, type: InstitutionType.MAIRIE, city: commune.city },
    });
  }

  // Créer les commissariats
  for (const commissariat of COMMISSARIATS) {
    await prisma.institution.upsert({
      where: { id: commissariat.id },
      update: {},
      create: { id: commissariat.id, name: commissariat.name, type: InstitutionType.POLICE, city: commissariat.city },
    });
  }

  const hash = await bcrypt.hash('password123', 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: 'superadmin@recensci.ci' },
    update: {},
    create: { email: 'superadmin@recensci.ci', passwordHash: hash, fullName: 'Super Administrateur', role: Role.SUPER_ADMIN },
  });

  // Admin Mairie Cocody (test)
  await prisma.user.upsert({
    where: { email: 'maire@recensci.ci' },
    update: {},
    create: { email: 'maire@recensci.ci', passwordHash: hash, fullName: 'Maire de Cocody', role: Role.ENTITY_ADMIN, institutionId: 'inst-cocody' },
  });

  // Admin Police Cocody (test)
  await prisma.user.upsert({
    where: { email: 'police@recensci.ci' },
    update: {},
    create: { email: 'police@recensci.ci', passwordHash: hash, fullName: 'Commissaire Cocody', role: Role.ENTITY_ADMIN, institutionId: 'inst-police-cocody' },
  });

  // Agent
  await prisma.user.upsert({
    where: { email: 'agent@recensci.ci' },
    update: {},
    create: { email: 'agent@recensci.ci', passwordHash: hash, fullName: 'Agent Koné', role: Role.AGENT, institutionId: 'inst-cocody' },
  });

  // Citoyen test
  await prisma.citizen.upsert({
    where: { nni: 'CI-0001-2024' },
    update: {},
    create: { nni: 'CI-0001-2024', email: 'citoyen@recensci.ci', passwordHash: hash, fullName: 'Kouassi Jean', city: 'Abidjan - Cocody', status: 'VALIDE' },
  });

  console.log('Seed termine');
  console.log('   superadmin@recensci.ci / password123  (SUPER_ADMIN)');
  console.log('   maire@recensci.ci      / password123  (ENTITY_ADMIN - Mairie Cocody)');
  console.log('   police@recensci.ci     / password123  (ENTITY_ADMIN - Police Cocody)');
  console.log('   agent@recensci.ci      / password123  (AGENT)');
  console.log('   citoyen@recensci.ci    / password123  (CITIZEN)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
