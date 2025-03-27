import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from './entities/referral.entity';
import { ReferralConversion } from './entities/referral-conversion.entity';
import { ReferralEarning } from './entities/referral-earning.entity';

@Injectable()
export class ReferralsService {
  constructor(
    @InjectRepository(Referral)
    private referralsRepository: Repository<Referral>,
    @InjectRepository(ReferralConversion)
    private conversionsRepository: Repository<ReferralConversion>,
    @InjectRepository(ReferralEarning)
    private earningsRepository: Repository<ReferralEarning>,
  ) {}

  async getReferralStats() {
    const totalSignups = await this.referralsRepository.count();
    
    const totalConversions = await this.conversionsRepository.count();
    
    const totalEarnings = await this.earningsRepository
      .createQueryBuilder('earnings')
      .select('SUM(earnings.amount)', 'total')
      .getRawOne();

    return {
      totalSignups,
      totalConversions,
      totalEarnings: Number(totalEarnings?.total || 0),
    };
  }

  async getUserReferralDetails(userId: string) {
    const referrals = await this.referralsRepository.find({
      where: { referrerId: userId },
      relations: ['conversions', 'earnings'],
    });

    const totalEarnings = await this.earningsRepository
      .createQueryBuilder('earnings')
      .innerJoin('earnings.referral', 'referral')
      .where('referral.referrerId = :userId', { userId })
      .select('SUM(earnings.amount)', 'total')
      .getRawOne();

    return {
      referrals,
      totalReferrals: referrals.length,
      totalConversions: referrals.reduce((acc, ref) => acc + ref.conversions.length, 0),
      totalEarnings: Number(totalEarnings?.total || 0),
    };
  }
} 