import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class SecurityService {
  validatePaymentInput(data: any) {
    const schema = Joi.object({
      amount: Joi.number().integer().min(1).required(),
      currency: Joi.string().length(3).required(),
      targetCurrency: Joi.string().length(3).required(),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }
}
