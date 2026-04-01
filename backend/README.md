# RecensCI — Backend NestJS

API REST pour le portail national d'état civil RecensCI, adaptée au frontend React/Vite existant.

## Stack
- NestJS 10 + TypeScript
- Supabase (Auth JWT + PostgreSQL)
- Passport JWT (même secret que Supabase)
- Swagger UI (`/docs`)

## Installation

```bash
cd backend
npm install
cp .env.example .env   # remplir les variables Supabase
npm run start:dev
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `SUPABASE_URL` | URL du projet Supabase (même que le frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (Settings > API) |
| `SUPABASE_JWT_SECRET` | JWT secret (Settings > API > JWT Settings) |
| `FRONTEND_URL` | URL du frontend pour CORS |

## Endpoints

| Module | Route | Rôles |
|---|---|---|
| Auth | `GET /v1/auth/me` | Tous |
| Citizens | `GET /v1/citizens` | AGENT+ |
| Citizens | `PATCH /v1/citizens/:id/validate` | AGENT+ |
| Vital Events | `POST /v1/events/:type` | AGENT+ |
| Vital Events | `POST /v1/events/sync` | AGENT+ (sync offline) |
| Agents | `GET /v1/agents` | ADMIN+ |
| Agents | `POST /v1/agents` | ADMIN+ |
| Security | `POST /v1/security/incidents` | AGENT+ |
| Security | `GET /v1/security/map` | AGENT+ |
| Exports | `GET /v1/exports/stats` | AGENT+ |
| Exports | `GET /v1/exports/data` | ADMIN+ |

## Architecture

```
src/
├── main.ts                  # Bootstrap + Swagger
├── app.module.ts            # Module racine
├── supabase/                # Client Supabase global
├── auth/                    # JWT Strategy + Guards + RBAC
├── citizens/                # Gestion citoyens (CitizenDatabase, CitizenValidation)
├── vital-events/            # Naissances, décès, mariages, divorces, migrations
├── agents/                  # Gestion agents (AddAgent, AgentList, AgentMessages)
├── security/                # Incidents (IncidentMap, IncidentReportForm)
└── exports/                 # Stats + export CSV/JSON (DataExportModule, AnalyticsPanel)
```
