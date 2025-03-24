import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeError, StripeErrorCodes } from './stripe.error';
import { StripeTransaction } from './stripe.entity';
import { getRepository } from 'typeorm';
import { CurrencyService } from './currency.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly currencyService: CurrencyService) {
    this.stripe = new Stripe('your-stripe-secret-key', {
      apiVersion: '2023-08-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string, targetCurrency: string) {
    const convertedAmount = await this.currencyService.convertCurrency(amount, currency, targetCurrency);
    // this.logger.logPaymentIntentCreation(convertedAmount, targetCurrency);
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(convertedAmount * 100), // convert to cents
        currency: targetCurrency,
        payment_method_types: ['card'],
      });
      const transaction = new StripeTransaction();
      transaction.amount = convertedAmount;
      transaction.currency = targetCurrency;
      transaction.status = 'succeeded';
      await getRepository(StripeTransaction).save(transaction);
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      // this.logger.logError(error);
      throw new StripeError(StripeErrorCodes.PAYMENT_INTENT_CREATION_FAILED, 'Failed to create payment intent');
    }
  }
}
