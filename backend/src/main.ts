import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

// Load environment variables before anything else
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — must be enabled before helmet and other middleware
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = [
    'https://thegolfpress.com',
    'https://www.thegolfpress.com',
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter((origin): origin is string => !!origin);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || !isProduction) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
  });

  // Security headers - configured to play nice with CORS
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }));

  // Cookie parsing
  app.use(cookieParser());

  // Global validation pipe — strips unknown fields, validates all inputs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // Strip properties not in DTO
    forbidNonWhitelisted: true, // Throw error if unknown properties sent
    transform: true,           // Auto-transform payloads to DTO instances
  }));

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
