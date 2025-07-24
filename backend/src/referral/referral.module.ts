import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ReferralCode } from "./entities/referral-code.entity"
import { ReferralInvite } from "./entities/referral-invite.entity"
import { ReferralBonus } from "./entities/referral-bonus.entity"
import { ReferralCodeService } from "./services/referral-code.service"
import { ReferralInviteService } from "./services/referral-invite.service"
import { ReferralBonusService } from "./services/referral-bonus.service"
import { ReferralService } from "./services/referral.service"
import { ReferralController } from "./controllers/referral.controller"

@Module({
  imports: [TypeOrmModule.forFeature([ReferralCode, ReferralInvite, ReferralBonus])],
  controllers: [ReferralController],
  providers: [ReferralCodeService, ReferralInviteService, ReferralBonusService, ReferralService],
  exports: [ReferralService, ReferralCodeService, ReferralInviteService, ReferralBonusService],
})
export class ReferralModule {}
