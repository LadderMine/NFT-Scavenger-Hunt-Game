import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import * as dotenv from 'dotenv';
import { AuditLogInterceptor } from './audit-log/interceptor/audit-log.interceptor';
import { AuditLogService } from './audit-log/audit-log.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Enable global validation, exception filter, and interceptor for audit logging
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new AuditLogInterceptor(app.get(AuditLogService)));

  // Enable CORS (reads from configService if set)
  app.enableCors(configService.get('appConfig.cors'));

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NFT-Scavengers Hunt-Game API')
    .setDescription(
      "The NFT Scavengers Hunt game API provides endpoints for managing users, puzzles, NFTs, scores, answers, hints, and user progress. This API allows developers to build and integrate the game's functionality into their applications.",
    )
    .addServer('http://localhost:3000/scavengers-hunt-game')
    .addTag('NFT-Scavengers Hunt-Game')
    .setBasePath('/api')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
    .setContact(
      'Yusuf Tomilola',
      'http://localhost:3000/contact',
      'scavengers_hunt@game.com',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your JWT token in the format: "Bearer {your_token}"',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('doc', app, document); // Swagger UI available at /doc

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
