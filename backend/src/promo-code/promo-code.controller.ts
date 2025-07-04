// src/promo-code/promo-code.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RedeemPromoCodeDto } from 'src/promo-code/dto/redeem-promo-code.dto';
import { PromoCodeService } from './promo-code.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('promocode')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  redeem(@Body() dto: RedeemPromoCodeDto, @Request() req) {
    return this.promoCodeService.redeem(dto.code, req.user.userId);
  }
}
