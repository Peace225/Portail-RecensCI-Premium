# RecensCI Mobile

Application React Native (Expo) pour le portail national d'état civil RecensCI.

## Stack
- Expo SDK 54 + TypeScript
- React Navigation (Stack + Bottom Tabs)
- Redux Toolkit
- Axios + expo-secure-store (JWT)
- Android first

## Installation

```bash
cd mobile
npm install
npx expo start --android
```

## Configuration

L'API pointe vers `http://10.0.2.2:3000/v1` (localhost depuis l'émulateur Android).

Pour un device physique, modifier `src/services/api.ts` :
```ts
export const API_BASE_URL = 'http://TON_IP_LOCAL:3000/v1';
```

## Comptes de test

| Email | Mot de passe | Rôle | App |
|---|---|---|---|
| superadmin@recensci.ci | password123 | Super Admin | Dashboard Admin |
| maire@recensci.ci | password123 | Admin Mairie | Dashboard Admin |
| police@recensci.ci | password123 | Admin Police | Dashboard Admin |
| agent@recensci.ci | password123 | Agent | Dashboard Agent |
| citoyen@recensci.ci | password123 | Citoyen | Dashboard Citoyen |

## Architecture

```
src/
├── services/api.ts          Axios + JWT interceptors
├── store/                   Redux (userSlice)
├── hooks/useAuth.ts         Session check au démarrage
├── theme/                   Colors + Typography
├── components/ui/           Button, Input, Card, Badge
├── navigation/
│   ├── RootNavigator.tsx    Switch rôle → navigateur
│   ├── CitizenNavigator.tsx Tabs + Stack citoyen
│   ├── AgentNavigator.tsx   Tabs + Stack agent (16 modules)
│   └── AdminNavigator.tsx   Tabs + Stack admin/mairie/police
└── screens/
    ├── auth/LoginScreen.tsx
    ├── citizen/             6 écrans
    ├── agent/forms/         10 formulaires
    ├── admin/               7 écrans
    └── shared/              5 écrans partagés
```

## Modules couverts (16/16)

1. Naissance ✅
2. Décès ✅
3. Mariage civil ✅
4. Divorce ✅
5. Mariage coutumier ✅
6. Accident routier ✅
7. Homicide ✅
8. Mort maternelle ✅
9. Migration interne ✅
10. Flux international ✅
11. Naissance hors établissement ✅
12. Certificats & documents ✅
13. Alertes sanitaires ✅
14. Support & tickets ✅
15. Audit (logs) ✅
16. API partenaires (clés) ✅
