// src/promo-code/promo-code.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCode } from 'src/promo-code/entities/promo-code.entities';
import { PromoCodeRedemption } from 'src/promo-code/entities/promo-code-redemption.entity';
import { User } from 'src/auth/entities/user.entity';
import { PromoCodeService } from 'src/promo-code/promo-code.service'
import { PromoCodeController } from 'src/promo-code/promo-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, PromoCodeRedemption, User])],
  controllers: [PromoCodeController],
  providers: [PromoCodeService],
})
export class PromoCodeModule {}
