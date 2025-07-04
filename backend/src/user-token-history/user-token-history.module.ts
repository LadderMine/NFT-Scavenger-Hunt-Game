import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { UserTokenHistoryService } from "./services/user-token-history.service"
import { TokenHistoryController } from "./controllers/token-history.controller"
import { TokenHistory } from "./entities/token-history.entity"
import { AdminGuard } from "./guards/admin.guard"

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TokenHistory]),
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
  providers: [UserTokenHistoryService, AdminGuard],
  controllers: [TokenHistoryController],
  exports: [UserTokenHistoryService],
})
export class UserTokenHistoryModule {}
