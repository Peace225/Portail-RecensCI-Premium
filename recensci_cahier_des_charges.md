# Cahier des Charges — Projet RecensCI

## Présentation Générale

## Résumé exécutif

**RecensCI** est une plateforme web nationale de sécurité publique et de gestion des données démographiques :
naissance, décès, mariage, divorce, accidents routiers, homicides, migrations, etc.

L’objectif est de centraliser les données pour :

- la planification publique
- la santé
- la sécurité
- les politiques migratoires

tout en garantissant :

- confidentialité
- interopérabilité
- résilience
- traçabilité

---

## Contexte

Les systèmes actuels sont :

- fragmentés
- souvent papier
- cloisonnés
- lents
- peu interopérables

Cela provoque :

- retards statistiques
- incohérences
- difficulté de prise de décision
- accès limité aux services en zones rurales

---

## Objectifs

- Centraliser les événements démographiques
- Fournir des statistiques en quasi temps réel
- Assurer l’interopérabilité avec les systèmes existants
- Garantir la conformité légale
- Inclure les populations rurales
- Garantir sécurité et confidentialité

---

## Impacts attendus

- amélioration de la qualité des données
- réduction des délais de recensement
- meilleure planification publique
- meilleure réactivité face aux crises
- outil de pilotage pour sécurité publique et migrations

---

# Architecture Technique

## Stack recommandé

### Frontend

- React ou Vue.js
- PWA hors ligne

### Backend

- Microservices
- Node.js / Python / Java
- API REST / GraphQL

### Base de données

- PostgreSQL
- Redis

### Messaging

- Kafka ou RabbitMQ

### Stockage

- Object Storage compatible S3 chiffré

### Hébergement

- Cloud hybride multi-zone
- autoscaling

### Monitoring

- Prometheus
- Grafana

### Sécurité

- TLS 1.3
- AES-256
- OAuth2 / OpenID Connect
- MFA
- RBAC

---

# Modules Fonctionnels

## Modules principaux

1. Naissance
2. Décès
3. Mariage
4. Divorce
5. Mariage coutumier
6. Accident routier
7. Homicide / Meurtre
8. Mort maternelle et périnatale
9. Migration interne
10. Flux étrangers et expatriés
11. Naissance hors établissement
12. Certificats et documents
13. Alertes sanitaires
14. Support et tickets
15. Administration et audit
16. Exports & API partenaires

---

# Arborescence Produit

## Portail Public PWA

- Accueil
- Informations publiques
- FAQ
- Demande certificat en ligne
- Suivi de demande
- Connexion citoyen

## Application Agent PWA

- Dashboard agent
- Saisie naissance
- Saisie décès
- Saisie mariage
- Saisie divorce
- Saisie accident
- Saisie homicide
- Saisie migration
- Mode hors ligne
- Support
- Formation intégrée

## Backoffice

- Dashboard national temps réel
- Gestion des enregistrements
- Gestion des doublons
- Workflows métier
- Interface judiciaire
- Rapports & exports

## Console Admin

- Utilisateurs & RBAC
- Structures partenaires
- Règles métier
- Clés API
- Monitoring
- Sauvegardes
- Audit & conformité

## Portail Développeur

- Documentation API
- Endpoints ingestion
- Endpoints consultation
- Gestion abonnements API

---

# Endpoints API principaux

## Ingestion

```http
POST /ingest/birth
POST /ingest/death
POST /ingest/marriage
POST /ingest/divorce
POST /ingest/accident
POST /ingest/homicide
POST /ingest/migration
```

## Consultation

```http
GET /person/{id}
GET /dashboard/summary
GET /export/statistics
```

---

# Déploiement

## Phases projet

### Phase 1 — Cadrage

- cahier des charges
- gouvernance
- architecture

### Phase 2 — MVP

- naissance
- décès
- mariage
- décès maternel

### Phase 3 — Pilote

- Abidjan
- 2 régions rurales

### Phase 4 — Montée en charge

- intégration nationale
- police
- tribunaux
- migrations

### Phase 5 — Déploiement national

- formation massive
- support terrain
- transfert opérationnel

---

# DevOps

- Kubernetes
- CI/CD
- Kafka / RabbitMQ
- ELK
- Prometheus
- Grafana
- Backups offsite
- PRA

---

# Annexes à produire

- ERD détaillé
- Matrice RBAC
- Payloads API
- Plan de formation
- Checklist sécurité
- Calendrier détaillé
- Documentation UX/UI

---

# Recommandation pour Kiro IDE

Utiliser ce document comme base de :

- architecture monorepo
- domain driven design
- microservices
- backlog technique
- tickets de développement
- génération des modules backend/frontend

