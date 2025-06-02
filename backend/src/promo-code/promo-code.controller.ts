import { 
    Controller, 
    Post, 
    Get, 
    Put, 
    Delete, 
    Body, 
    Param, 
    UsePipes, 
    ValidationPipe 
  } from '@nestjs/common';
import { PromoCode } from './entity/promo-code.entity';
import { PromoCodeService } from './providers/promo-code.service';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dtos/promo-code.dto';
  
  @Controller('promo-codes')
  export class PromoCodeController {
    constructor(private promoCodeService: PromoCodeService) {}
  
    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createPromoCode(
      @Body() createPromoCodeDto: CreatePromoCodeDto
    ): Promise<PromoCode> {
      return this.promoCodeService.createPromoCode(createPromoCodeDto);
    }
  
    @Get()
    async getAllPromoCodes(): Promise<PromoCode[]> {
      return this.promoCodeService.getAllPromoCodes();
    }
  
    @Get(':code')
    async getPromoCodeByCode(@Param('code') code: string): Promise<PromoCode> {
      return this.promoCodeService.getPromoCodeByCode(code);
    }
  
    @Put(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async updatePromoCode(
      @Param('id') id: string,
      @Body() updatePromoCodeDto: UpdatePromoCodeDto
    ): Promise<PromoCode> {
      return this.promoCodeService.updatePromoCode(id, updatePromoCodeDto);
    }
  
    @Delete(':id')
    async deletePromoCode(@Param('id') id: string): Promise<void> {
      return this.promoCodeService.deletePromoCode(id);
    }
  
    @Get('validate/:code')
    async validatePromoCode(@Param('code') code: string): Promise<PromoCode> {
      return this.promoCodeService.validatePromoCode(code);
    }
  }