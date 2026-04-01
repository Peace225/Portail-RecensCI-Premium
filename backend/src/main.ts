import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix global de l'API (correspond à VITE_API_URL = .../v1)
  app.setGlobalPrefix('v1');

  // Validation automatique des DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS pour le frontend React/Vite
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Swagger UI
  const config = new DocumentBuilder()
    .setTitle('RecensCI API')
    .setDescription("API du Portail National d'État Civil - RecensCI")
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`RecensCI API démarrée sur http://localhost:${port}/v1`);
  console.log(`Swagger disponible sur http://localhost:${port}/docs`);
}
bootstrap();
