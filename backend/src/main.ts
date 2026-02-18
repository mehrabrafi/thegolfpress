import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Cookie parsing
  app.use(cookieParser());

  // Global validation pipe — strips unknown fields, validates all inputs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error if unknown properties sent
    transform: true,           // Auto-transform payloads to DTO instances
  }));

  // CORS — dynamic origin based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = [
    'https://thegolfpress.com',
    'https://www.thegolfpress.com',
    process.env.FRONTEND_URL,
  ].filter((origin): origin is string => !!origin);

  app.enableCors({
    origin: isProduction
      ? allowedOrigins
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
