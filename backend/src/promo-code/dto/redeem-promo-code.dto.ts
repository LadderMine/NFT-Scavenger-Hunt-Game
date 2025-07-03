// src/promo-code/dto/redeem-promo-code.dto.ts
import { IsString } from 'class-validator';

export class RedeemPromoCodeDto {
  @IsString()
  code: string;
}
