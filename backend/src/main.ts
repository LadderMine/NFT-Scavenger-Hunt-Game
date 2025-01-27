import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS with config
  app.enableCors(configService.get('appConfig.cors'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();