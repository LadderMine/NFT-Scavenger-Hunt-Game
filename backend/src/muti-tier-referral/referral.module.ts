import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { ReferralController } from "./referral.controller"
import { ReferralService } from "./referral.service"
import { Referral } from "./entities/referral.entity"
import { ReferralEarning } from "./entities/referral-earning.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Referral, ReferralEarning]), ConfigModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}

