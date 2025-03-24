import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { UserSubscription } from './entities/user-subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscribeUserDto } from './dto/subscribe-user.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    
    @InjectRepository(UserSubscription)
    private readonly userSubscriptionRepo: Repository<UserSubscription>,
  ) {}

  async createSubscription(dto: CreateSubscriptionDto) {
    const subscription = this.subscriptionRepo.create(dto);
    return this.subscriptionRepo.save(subscription);
  }

  async getAllSubscriptions() {
    return this.subscriptionRepo.find();
  }

  async getUserSubscription(userId: number) {
    const subscription = await this.userSubscriptionRepo.findOne({
      where: { userId },
      relations: ['subscription'],
    });

    if (!subscription) throw new NotFoundException('No active subscription found');

    return subscription;
  }

  async subscribeUser(dto: SubscribeUserDto) {
    // Ensure the user doesn't have an active subscription
    const existingSubscription = await this.userSubscriptionRepo.findOne({ where: { userId: dto.userId, paymentStatus: 'paid' } });
    
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }

    const subscription = await this.subscriptionRepo.findOne({ where: { id: dto.subscriptionId } });
    if (!subscription) throw new NotFoundException('Subscription plan not found');

    const endDate = new Date();
    if (subscription.duration === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (subscription.duration === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const newSubscription = this.userSubscriptionRepo.create({
      userId: dto.userId,
      subscription,
      startDate: new Date(),
      endDate,
      paymentStatus: 'paid', // Simulating successful payment
    });

    return this.userSubscriptionRepo.save(newSubscription);
  }
}
