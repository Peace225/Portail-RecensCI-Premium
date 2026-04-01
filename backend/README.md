# RecensCI — Backend NestJS

API REST pour le portail national d'état civil RecensCI.

## Stack
- NestJS 10 + TypeScript
- PostgreSQL 16 (Docker)
- Prisma ORM
- JWT (passport-jwt)
- Swagger UI (`/docs`)

## Démarrage rapide

### 1. Lancer PostgreSQL
```bash
docker-compose up postgres -d
```

### 2. Installer et migrer
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

### 3. Démarrer l'API
```bash
npm run start:dev
# → http://localhost:3000/v1
# → http://localhost:3000/docs  (Swagger)
```

## Comptes de test (seed)

| Email | Mot de passe | Rôle |
|---|---|---|
| superadmin@recensci.ci | password123 | SUPER_ADMIN |
| maire@recensci.ci | password123 | ENTITY_ADMIN |
| agent@recensci.ci | password123 | AGENT |
| citoyen@recensci.ci | password123 | CITIZEN |

## Endpoints principaux

| Route | Description |
|---|---|
| `POST /v1/auth/login` | Login → JWT |
| `GET /v1/auth/me` | Profil connecté |
| `GET /v1/citizens` | Liste citoyens |
| `PATCH /v1/citizens/:id/validate` | Valider un citoyen |
| `POST /v1/events/:type` | Créer naissance/décès/mariage... |
| `POST /v1/events/sync` | Sync batch offline |
| `GET /v1/agents` | Liste agents |
| `POST /v1/agents` | Créer un agent |
| `GET /v1/security/map` | Données carte incidents |
| `GET /v1/exports/stats` | Statistiques globales |
| `GET /v1/exports/data?table=birth_records` | Export données |

## Variables d'environnement (.env)

```env
DATABASE_URL="postgresql://recensci:recensci_secret@localhost:5432/recensci"
JWT_SECRET="recensci_jwt_super_secret_local"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

## Commandes Prisma utiles

```bash
npm run db:migrate    # Créer une migration
npm run db:generate   # Régénérer le client Prisma
npm run db:seed       # Insérer les données de test
npm run db:studio     # Ouvrir Prisma Studio (GUI)
```
