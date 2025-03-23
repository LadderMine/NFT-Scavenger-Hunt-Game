import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('your-stripe-secret-key', {
      apiVersion: '2023-08-16',
    });
  }

  async createSubscription(customerId: string, priceId: string) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
      });
      return subscription;
    } catch (error) {
      throw new Error('Failed to create subscription');
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const confirmation = await this.stripe.subscriptions.del(subscriptionId);
      return confirmation;
    } catch (error) {
      throw new Error('Failed to cancel subscription');
    }
  }
}
