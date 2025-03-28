import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './providers/promo-code.service';
import { PromoCode } from './entity/promo-code.entity';
import { PromoCodeRepository } from './repository/promo-code.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromoCode, PromoCodeRepository])
  ],
  controllers: [PromoCodeController],
  providers: [PromoCodeService],
  exports: [PromoCodeService]
})
export class PromoCodeModule{} 