import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { User } from "./entities/user.entity"
import { AuthController } from "./controllers/auth.controller"
import { AuthService } from "./services/auth.service"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET") || "your-secret-key",
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN") || "15m",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, PassportModule],
})
export class AuthModule {}
