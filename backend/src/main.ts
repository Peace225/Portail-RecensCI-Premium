import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // ─── SWAGGER ───────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('RecensCI API')
    .setDescription(
      `## Portail National d'État Civil — Côte d'Ivoire
      
API REST du système RecensCI. Authentification via JWT Bearer.

### Workflow
1. **POST /v1/auth/login** → récupérer le \`access_token\`
2. Cliquer **Authorize** en haut à droite et coller le token
3. Tous les endpoints protégés sont maintenant accessibles

### Rôles
| Rôle | Accès |
|---|---|
| \`CITIZEN\` | Profil personnel uniquement |
| \`AGENT\` | Déclarations + citoyens |
| \`ENTITY_ADMIN\` | Mairie / Police — agents de son institution |
| \`ADMIN\` | Backoffice complet |
| \`SUPER_ADMIN\` | Accès total |

### Comptes de test
\`\`\`
superadmin@recensci.ci / password123
maire@recensci.ci      / password123  
agent@recensci.ci      / password123
citoyen@recensci.ci    / password123
\`\`\`
      `,
    )
    .setVersion('1.0')
    .setContact('RecensCI', 'https://recensci.gouv.ci', 'api@recensci.gouv.ci')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Coller le token obtenu via POST /v1/auth/login',
      },
      'JWT',
    )
    .addTag('Auth', 'Authentification et profil')
    .addTag('Citizens', 'Gestion des citoyens')
    .addTag('Vital Events', 'Naissances, décès, mariages, divorces, migrations')
    .addTag('Agents', 'Gestion des agents et messages')
    .addTag('Security', 'Incidents de sécurité et carte')
    .addTag('Exports & Stats', 'Statistiques et export de données')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,         // garde le token entre les rechargements
      defaultModelsExpandDepth: 1,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'RecensCI API Docs',
    customfavIcon: '/public/images/logo.png',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\nRecensCI API -> http://localhost:${port}/v1`);
  console.log(`Swagger UI   -> http://localhost:${port}/docs\n`);
}
bootstrap();
