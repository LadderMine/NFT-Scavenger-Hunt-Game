import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { VerificationService } from "./services/verification.service"
import { JwtGuard } from "./guards/jwt.guard"
import { WalletGuard } from "./guards/wallet.guard"
import { TokenLoggingInterceptor } from "./interceptors/token-logging.interceptor"
import { TokenHeaderInterceptor } from "./interceptors/token-header.interceptor"

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "1h"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [VerificationService, JwtGuard, WalletGuard, TokenLoggingInterceptor, TokenHeaderInterceptor],
  exports: [VerificationService, JwtGuard, WalletGuard, TokenLoggingInterceptor, TokenHeaderInterceptor],
})
export class TokenVerificationModule {}
