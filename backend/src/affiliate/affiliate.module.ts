import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AffiliateController } from "./controllers/affiliate.controller"
import { AffiliateService } from "./services/affiliate.service"
import { Affiliate } from "./entities/affiliate.entity"
import { Referral } from "./entities/referral.entity"
import { Payout } from "./entities/payout.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, Referral, Payout])],
  controllers: [AffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}

