import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyRewardLog } from './entities/daily-reward-log.entity';

@Injectable()
export class DailyRewardService {
  constructor(
    @InjectRepository(DailyRewardLog)
    private readonly rewardLogRepository: Repository<DailyRewardLog>,
  ) {}

  async dailyCheckIn(userId: string): Promise<DailyRewardLog> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const lastCheckIn = await this.rewardLogRepository.findOne({
      where: { userId },
      order: { timestamp: 'DESC' },
    });

    
    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn.timestamp);
      lastCheckInDate.setHours(0, 0, 0, 0); 

      if (lastCheckInDate.getTime() === today.getTime()) {
        throw new ConflictException('Reward already claimed for today.');
      }
    }

    
    let currentStreak = 1; 
    if (lastCheckIn) {
      const lastCheckInDate = new Date(lastCheckIn.timestamp);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0); 
      
      if (lastCheckInDate.getTime() === yesterday.getTime()) {
        currentStreak = lastCheckIn.streak + 1;
      }
      
    }

    const newLog = this.rewardLogRepository.create({
      userId,
      streak: currentStreak,
    });

    return this.rewardLogRepository.save(newLog);
  }
}