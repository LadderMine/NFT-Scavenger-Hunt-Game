/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { AccessTokenGuard } from './guard/access-token/access-token.guard';
import { LogInProvider } from './providers/log-in.provider';
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { RolesGuard } from './guard/roles.guard';
import jwtConfig from './config/jwt.config';
import databaseConfig from '../config/database.config';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { IPLocationMiddleware } from '../location/ip-location.middleware';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(databaseConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    AuditLogsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AccessTokenGuard,
    LogInProvider,
    GenerateTokenProvider,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, HashingProvider, AccessTokenGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IPLocationMiddleware).forRoutes('auth/login');
  }
}
