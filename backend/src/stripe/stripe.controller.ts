import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SecurityService } from './stripe.security';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService, private readonly securityService: SecurityService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body('amount') amount: number, @Body('currency') currency: string) {
    try {
      this.securityService.validatePaymentInput({ amount, currency, targetCurrency });
      const paymentIntent = await this.stripeService.createPaymentIntent(amount, currency);
      return paymentIntent;
    } catch (error) {
      throw new HttpException('Payment Intent creation failed', HttpStatus.BAD_REQUEST);
    }
  }
}
