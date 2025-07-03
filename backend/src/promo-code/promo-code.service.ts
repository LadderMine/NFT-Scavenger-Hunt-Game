// src/promo-code/promo-code.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoCode } from 'src/promo-code/entities/promo-code.entities';
import { PromoCodeRedemption } from './entities/promo-code-redemption.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepo: Repository<PromoCode>,

    @InjectRepository(PromoCodeRedemption)
    private redemptionRepo: Repository<PromoCodeRedemption>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async redeem(code: string, userId: string) {
    const promo = await this.promoCodeRepo.findOne({ where: { code } });
    if (!promo) throw new NotFoundException('Promo code not found');

    if (new Date() > promo.expiresAt) {
      throw new BadRequestException('Promo code has expired');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const alreadyRedeemed = await this.redemptionRepo.findOne({
      where: { user: { id: userId }, promoCode: { id: promo.id } },
    });

    if (alreadyRedeemed) {
      throw new BadRequestException('Promo code already used by user');
    }

    const redemption = this.redemptionRepo.create({ user, promoCode: promo });
    await this.redemptionRepo.save(redemption);

    return { message: 'Promo code redeemed successfully' };
  }
}
