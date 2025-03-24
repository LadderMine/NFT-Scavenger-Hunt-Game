import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class RefundService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('your-stripe-secret-key', {
      apiVersion: '2023-08-16',
    });
  }

  async processRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
      });
      return refund;
    } catch (error) {
      throw new Error('Failed to process refund');
    }
  }
}
