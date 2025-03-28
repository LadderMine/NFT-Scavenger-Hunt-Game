import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './referrals.service';
import { Referral } from './entities/referral.entity';
import { ReferralConversion } from './entities/referral-conversion.entity';
import { ReferralEarning } from './entities/referral-earning.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Referral,
      ReferralConversion,
      ReferralEarning,
    ]),
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService],
  exports: [ReferralsService],
})
export class ReferralsModule {} 