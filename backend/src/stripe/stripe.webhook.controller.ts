import { Controller, Post, Req, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('stripe/webhook')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('your-stripe-secret-key', {
      apiVersion: '2023-08-16',
    });
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(@Req() request: Request) {
    const sig = request.headers['stripe-signature'];

    try {
      const event = this.stripe.webhooks.constructEvent(
        request.body,
        sig,
        'your-webhook-secret'
      );

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent was successful!');
          break;
        case 'payment_intent.payment_failed':
          const paymentIntentFailed = event.data.object;
          console.log('PaymentIntent failed!');
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (err) {
      throw new HttpException('Webhook Error', HttpStatus.BAD_REQUEST);
    }
  }
}
