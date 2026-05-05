# RecensCI Mobile

Application React Native (Expo) pour le portail national d'état civil RecensCI.
Synchronisée avec le frontend web (branche `main`) et le backend NestJS.

## Stack
- Expo SDK 52+ + TypeScript
- React Navigation (Stack + Bottom Tabs)
- Redux Toolkit
- Axios + expo-secure-store (JWT)
- @expo/vector-icons (Ionicons)
- Android first

## Prérequis
- Node.js 20 LTS (recommandé) ou 22+
- Expo Go sur Android (Play Store)
- Backend NestJS démarré sur port 3000

## Installation & Démarrage

```bash
cd mobile
npm install
npx expo start
```

Scanne le QR code avec **Expo Go** sur ton téléphone Android.

## Configuration API

Le fichier `src/services/api.ts` pointe vers :
- `http://10.0.2.2:3000/v1` — émulateur Android
- Changer l'IP pour un device physique sur le même réseau WiFi

## Comptes de test

| Email | Mot de passe | Rôle | Dashboard |
|---|---|---|---|
| superadmin@recensci.ci | password123 | Super Admin | Admin |
| maire@recensci.ci | password123 | Admin Mairie | Admin |
| police@recensci.ci | password123 | Admin Police | Admin |
| agent@recensci.ci | password123 | Agent | Agent |
| citoyen@recensci.ci | password123 | Citoyen | Citoyen |

## Fonctionnalités

### Chatbot IA
- Disponible sur toutes les pages (bouton flottant)
- Répond aux questions sur le NNI, l'enrôlement, les blocages, les pertes de carte
- Mémoire de session (suggestions rapides)

### Graphiques dynamiques
- Compteur de population live (page citoyen)
- Graphique événements vitaux (dashboard agent/admin)
- Barres de statistiques par module

### Switch de rôle automatique
- Login → détection du rôle → navigateur adapté
- CITIZEN → tabs (Accueil, Demandes, Notifs, Profil)
- AGENT → tabs (Dashboard, Notifs, Support) + 16 modules de saisie
- ADMIN/ENTITY_ADMIN/SUPER_ADMIN → tabs (Dashboard, Notifs, Support) + modules admin

## Architecture

```
src/
├── services/api.ts              Axios + JWT interceptors
├── store/userSlice.ts           Redux (id, name, email, role, nni, photoUrl, structureId)
├── hooks/useAuth.ts             Session check au démarrage
├── theme/colors.ts              Palette couleurs
├── components/
│   ├── ui/                      Button, Input, Card, Badge
│   ├── AIChatbot.tsx            Chatbot IA avec mémoire de session
│   ├── ChatFAB.tsx              Bouton flottant chatbot
│   └── DynamicChart.tsx         Graphiques natifs (bar, trend, counter)
├── navigation/
│   ├── RootNavigator.tsx        Switch rôle + ChatFAB global
│   ├── CitizenNavigator.tsx     Tabs + Stack citoyen
│   ├── AgentNavigator.tsx       Tabs + Stack agent (16 modules)
│   └── AdminNavigator.tsx       Tabs + Stack admin
└── screens/
    ├── auth/LoginScreen.tsx
    ├── citizen/                 7 écrans
    ├── agent/forms/             10 formulaires
    ├── admin/                   7 écrans
    └── shared/                  5 écrans partagés
```

## Modules couverts (16/16)

| # | Module | Endpoint |
|---|---|---|
| 1 | Naissance | POST /events/birth |
| 2 | Décès | POST /events/death |
| 3 | Mariage civil | POST /events/marriage |
| 4 | Divorce | POST /events/divorce |
| 5 | Mariage coutumier | POST /modules/customary-marriage |
| 6 | Accident routier | POST /security/incidents |
| 7 | Homicide | POST /security/incidents |
| 8 | Mort maternelle | POST /events/birth (type: MATERNAL_DEATH) |
| 9 | Migration interne | POST /events/migration (INTERNE) |
| 10 | Flux international | POST /events/migration (INTERNATIONAL) |
| 11 | Naissance hors établissement | POST /modules/out-of-facility-birth |
| 12 | Certificats & documents | POST /modules/certificates |
| 13 | Alertes sanitaires | POST /modules/health-alerts |
| 14 | Support & tickets | POST /modules/support |
| 15 | Audit (logs) | GET /admin/audit |
| 16 | API partenaires | GET/POST /admin/api-keys |
