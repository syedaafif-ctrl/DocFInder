// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOriginsEnv.includes('*') ||
          allowedOriginsEnv.includes(origin) ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1') ||
          origin.endsWith('.netlify.app')
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      credentials: true,
    },
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
  }));

  // Compression
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: 422,
    }),
  );

  // Swagger Documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Swastha BD API')
      .setDescription('Bangladesh Healthcare Doctor Discovery Platform API')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('doctors', 'Doctor management')
      .addTag('hospitals', 'Hospital management')
      .addTag('search', 'Search functionality')
      .addTag('appointments', 'Appointment booking')
      .addTag('reviews', 'Reviews and ratings')
      .addTag('admin', 'Admin dashboard')
      .addTag('analytics', 'Analytics and reporting')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = configService.get<number>('app.port') || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`
  ╔══════════════════════════════════════════╗
  ║         SWASTHA BD API SERVER           ║
  ╠══════════════════════════════════════════╣
  ║  Status:   Running                      ║
  ║  URL:      http://localhost:${port}         ║
  ║  Docs:     http://localhost:${port}/api/docs║
  ║  Version:  1.0.0                        ║
  ╚══════════════════════════════════════════╝
  `);
}

bootstrap();
