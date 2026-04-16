# RecensCI — Backend NestJS

API REST du portail national d'état civil RecensCI.

## Stack
- NestJS 10 + TypeScript
- PostgreSQL 16 (Docker)
- Prisma ORM
- JWT (passport-jwt + bcrypt)
- Swagger UI (`/docs`)

## Démarrage rapide

```bash
# 1. PostgreSQL
docker-compose up postgres -d

# 2. Dépendances + migration + seed
npm install
npx prisma migrate dev --name init
npx prisma db seed

# 3. Démarrer
npm run start:dev
# API    → http://localhost:3000/v1
# Swagger → http://localhost:3000/docs
```

## Variables d'environnement

Copier `.env.example` → `.env` et renseigner :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@127.0.0.1:5432/recensci"
JWT_SECRET="recensci_jwt_super_secret_local"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

> Note : utiliser `127.0.0.1` plutôt que `localhost` pour éviter un bug de parsing Prisma avec les mots de passe numériques.

## Comptes de test (seed)

| Email | Mot de passe | Rôle |
|---|---|---|
| superadmin@recensci.ci | password123 | SUPER_ADMIN |
| maire@recensci.ci | password123 | ENTITY_ADMIN |
| agent@recensci.ci | password123 | AGENT |
| citoyen@recensci.ci | password123 | CITIZEN |

## Endpoints

### Auth
| Méthode | Route | Description |
|---|---|---|
| POST | `/v1/auth/login` | Connexion → JWT |
| POST | `/v1/auth/register` | Inscription citoyen |
| GET | `/v1/auth/me` | Profil connecté |

### Citoyens
| Méthode | Route | Description |
|---|---|---|
| GET | `/v1/citizens` | Liste paginée |
| GET | `/v1/citizens/pending` | Dossiers en attente |
| GET | `/v1/citizens/flagged` | Dossiers suspects |
| GET | `/v1/citizens/nni/:nni` | Recherche par NNI |
| GET | `/v1/citizens/:id/profile` | Profil complet |
| GET | `/v1/citizens/:id/requests` | Demandes de documents |
| GET | `/v1/citizens/:id/social-benefits` | Prestations sociales |
| PATCH | `/v1/citizens/:id/validate` | Valider |
| PATCH | `/v1/citizens/:id/approve` | Approuver (flux) |
| PATCH | `/v1/citizens/:id/investigate` | Marquer suspect |
| PATCH | `/v1/citizens/:id/address` | Changer adresse |

### Événements vitaux
| Méthode | Route | Description |
|---|---|---|
| POST | `/v1/events/birth` | Naissance |
| POST | `/v1/events/death` | Décès |
| POST | `/v1/events/marriage` | Mariage (witnesses: array) |
| POST | `/v1/events/divorce` | Divorce |
| POST | `/v1/events/migration` | Migration |
| POST | `/v1/events/sync` | Sync batch offline |
| GET | `/v1/events/:type` | Liste par type |
| PATCH | `/v1/events/:type/:id/status` | Valider/Rejeter |

### Agents
| Méthode | Route | Description |
|---|---|---|
| GET | `/v1/agents` | Liste |
| POST | `/v1/agents` | Créer |
| DELETE | `/v1/agents/:id` | Supprimer |
| GET | `/v1/agents/:id/messages` | Messages |
| POST | `/v1/agents/:id/messages` | Envoyer message |

### Sécurité
| Méthode | Route | Description |
|---|---|---|
| POST | `/v1/security/incidents` | Déclarer incident |
| GET | `/v1/security/incidents` | Liste |
| GET | `/v1/security/map` | Données carte |
| POST | `/v1/security/emergency` | Urgence citoyen |

### Analytics
| Méthode | Route | Description |
|---|---|---|
| GET | `/v1/analytics/dashboard` | Stats globales |
| GET | `/v1/analytics/trend` | Tendance 6 mois |
| GET | `/v1/analytics/mairie` | Stats mairie |
| GET | `/v1/analytics/police` | Stats police |

### Notifications
| Méthode | Route | Description |
|---|---|---|
| GET | `/v1/notifications` | Mes notifications |
| PATCH | `/v1/notifications/:id/read` | Marquer lu |

### Exports
| Méthode | Route | Description |
|---|---|---|
| GET | `/v1/exports/stats` | Compteurs globaux |
| GET | `/v1/exports/data?table=...&format=csv` | Export CSV/JSON |

## Commandes utiles

```bash
npm run db:migrate   # Nouvelle migration
npm run db:generate  # Régénérer client Prisma
npm run db:seed      # Données de test
npm run db:studio    # Prisma Studio (GUI)
```
