import { Logger } from '@nestjs/common';

export class StripeLogger {
  private readonly logger = new Logger(StripeLogger.name);

  logPaymentIntentCreation(amount: number, currency: string) {
    this.logger.log(`Creating payment intent for amount: ${amount}, currency: ${currency}`);
  }

  logError(error: any) {
    this.logger.error(`Stripe error: ${error.message}`);
  }
}
