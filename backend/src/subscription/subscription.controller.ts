import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create')
  async createSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  @Get('plans')
  async getSubscriptions() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get('status/:userId')
  async getUserSubscription(@Param('userId', ParseIntPipe) userId: number) {
    return this.subscriptionService.getUserSubscription(userId);
  }

  @Post('subscribe')
  async subscribeUser(@Body() dto: SubscribeUserDto) {
    return this.subscriptionService.subscribeUser(dto);
  }
}
