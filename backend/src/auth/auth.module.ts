/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashingProvider } from './providers/hashing.provider';
import databaseConfig from 'config/database.config';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BcryptProvider } from './providers/bcrypt.provider';
import { AccessTokenGuard } from './guard/access-token/access-token.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { LogInProvider } from './providers/log-in.provider';
import { GenerateTokenProvider } from './providers/generate-token.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(databaseConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
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
  ],
  exports: [AuthService, HashingProvider, AccessTokenGuard],
})
export class AuthModule {}
