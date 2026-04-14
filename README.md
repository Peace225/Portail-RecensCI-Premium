# RecensCI — Portail National d'État Civil

Plateforme de recensement et d'état civil de Côte d'Ivoire.

## Stack

| Couche | Technologie |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS + Redux Toolkit |
| Backend | NestJS 10 + TypeScript + Prisma ORM |
| Base de données | PostgreSQL 16 |
| Auth | JWT local (passport-jwt + bcrypt) |
| API Docs | Swagger UI |

## Démarrage

```bash
# 1. Base de données
docker-compose up postgres -d

# 2. Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# API  → http://localhost:3000/v1
# Docs → http://localhost:3000/docs

# 3. Frontend
cd frontend
npm install
npm run dev
# App → http://localhost:5173
```

## Comptes de test

| Email | Mot de passe | Rôle | Accès |
|---|---|---|---|
| superadmin@recensci.ci | password123 | SUPER_ADMIN | Backoffice complet |
| maire@recensci.ci | password123 | ENTITY_ADMIN | Portail Mairie |
| agent@recensci.ci | password123 | AGENT | Dashboard agent |
| citoyen@recensci.ci | password123 | CITIZEN | Espace citoyen |

## Structure

```
├── frontend/          React PWA
├── backend/           NestJS API
│   ├── prisma/        Schéma + migrations + seed
│   └── src/
│       ├── auth/      Login, Register, JWT
│       ├── citizens/  Gestion citoyens
│       ├── vital-events/ Naissances, décès, mariages...
│       ├── agents/    Gestion agents
│       ├── security/  Incidents + urgences
│       ├── analytics/ Statistiques dashboards
│       ├── notifications/ Notifications
│       └── exports/   Export CSV/JSON
└── docker-compose.yml PostgreSQL local
```

## Branche active

`feature/nestjs-backend`
