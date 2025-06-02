import { Repository, EntityRepository } from 'typeorm';
import { PromoCode } from '../entity/promo-code.entity';


@EntityRepository(PromoCode)
export class PromoCodeRepository extends Repository<PromoCode> {
  [x: string]: any;
  async findActivePromoCode(code: string): Promise<PromoCode | undefined> {
    return this.createQueryBuilder('promoCode')
      .where('promoCode.code = :code', { code })
      .andWhere('promoCode.isActive = true')
      .andWhere('promoCode.expirationDate > :now OR promoCode.expirationDate IS NULL', { now: new Date() })
      .getOne();
  }

  async generateUniqueCode(prefix: string = 'REF', length: number = 6): Promise<string> {
    const randomString = Math.random().toString(36).substring(2, length + 2).toUpperCase();
    const fullCode = `${prefix}-${randomString}`;

    // Ensure the code is unique
    const existingCode = await this.findOne({ where: { code: fullCode } });
    return existingCode ? this.generateUniqueCode(prefix, length) : fullCode;
  }
}