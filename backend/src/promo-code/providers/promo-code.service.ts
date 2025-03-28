import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoCode } from '../entity/promo-code.entity';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from '../dtos/promo-code.dto';
import { PromoCodeRepository } from '../repository/promo-code.repository';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCodeRepository)
    private promoCodeRepository: PromoCodeRepository,
  ) {}

  async createPromoCode(createPromoCodeDto: CreatePromoCodeDto): Promise<PromoCode> {
    // If no code provided, generate a unique one
    const code = createPromoCodeDto.code || 
      await this.promoCodeRepository.generateUniqueCode();

    const promoCode = this.promoCodeRepository.create({
      ...createPromoCodeDto,
      code,
      isActive: createPromoCodeDto.isActive ?? true,
    });

    return this.promoCodeRepository.save(promoCode);
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode> {
    const promoCode = await this.promoCodeRepository.findActivePromoCode(code);
    
    if (!promoCode) {
      throw new NotFoundException('Promo code not found or expired');
    }

    return promoCode;
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    return this.promoCodeRepository.find();
  }

  async updatePromoCode(
    id: string, 
    updatePromoCodeDto: UpdatePromoCodeDto
  ): Promise<PromoCode> {
    const promoCode = await this.promoCodeRepository.findOne(id);

    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    // Merge the existing promo code with update data
    const updatedPromoCode = {
      ...promoCode,
      ...updatePromoCodeDto,
    };

    return this.promoCodeRepository.save(updatedPromoCode);
  }

  async deletePromoCode(id: string): Promise<void> {
    const result = await this.promoCodeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Promo code not found');
    }
  }

  async validatePromoCode(code: string): Promise<PromoCode> {
    const promoCode = await this.getPromoCodeByCode(code);

    if (!promoCode.isValid()) {
      throw new BadRequestException('Promo code is not valid');
    }

    return promoCode;
  }
}