// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health/health.controller';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { HospitalsModule } from './modules/hospitals/hospitals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule, DoctorsModule, HospitalsModule,
    // Feature modules land here as they're built:
    // DoctorsModule, HospitalsModule, AppointmentsModule, AuthModule, ...
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}