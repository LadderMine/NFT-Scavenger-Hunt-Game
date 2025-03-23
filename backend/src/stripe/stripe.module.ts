import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { StripeWebhookController } from './stripe.webhook.controller';
import { StripeLogger } from './stripe.logger';

@Module({
  controllers: [StripeController, StripeWebhookController],
  providers: [StripeService, StripeLogger],
})
export class StripeModule {}
