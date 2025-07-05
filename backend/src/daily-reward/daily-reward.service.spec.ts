
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DailyRewardService } from './daily-reward.service';
import { DailyRewardLog } from './entities/daily-reward-log.entity';

describe('DailyRewardService', () => {
  let service: DailyRewardService;
  let repo: Repository<DailyRewardLog>;

  const mockRewardLogRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyRewardService,
        {
          provide: getRepositoryToken(DailyRewardLog),
          useValue: mockRewardLogRepository,
        },
      ],
    }).compile();

    service = module.get<DailyRewardService>(DailyRewardService);
    repo = module.get<Repository<DailyRewardLog>>(getRepositoryToken(DailyRewardLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dailyCheckIn', () => {
    const userId = 'user-123';

    it('should start a streak at 1 for the first check-in', async () => {
      mockRewardLogRepository.findOne.mockResolvedValue(null);
      mockRewardLogRepository.create.mockReturnValue({ userId, streak: 1 });
      mockRewardLogRepository.save.mockResolvedValue({ id: 'uuid', userId, streak: 1, timestamp: new Date() });

      const result = await service.dailyCheckIn(userId);

      expect(repo.create).toHaveBeenCalledWith({ userId, streak: 1 });
      expect(result.streak).toBe(1);
    });

    it('should throw a ConflictException if already checked in today', async () => {
      const today = new Date();
      mockRewardLogRepository.findOne.mockResolvedValue({ userId, streak: 3, timestamp: today });

      await expect(service.dailyCheckIn(userId)).rejects.toThrow(ConflictException);
    });

    it('should continue a streak if the last check-in was yesterday', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastCheckIn = { userId, streak: 3, timestamp: yesterday };
      
      mockRewardLogRepository.findOne.mockResolvedValue(lastCheckIn);
      mockRewardLogRepository.create.mockReturnValue({ userId, streak: 4 });
      mockRewardLogRepository.save.mockResolvedValue({ id: 'uuid', userId, streak: 4, timestamp: new Date() });

      const result = await service.dailyCheckIn(userId);

      expect(repo.create).toHaveBeenCalledWith({ userId, streak: 4 });
      expect(result.streak).toBe(4);
    });

    it('should reset a streak if the last check-in was before yesterday', async () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const lastCheckIn = { userId, streak: 5, timestamp: twoDaysAgo };

      mockRewardLogRepository.findOne.mockResolvedValue(lastCheckIn);
      mockRewardLogRepository.create.mockReturnValue({ userId, streak: 1 });
      mockRewardLogRepository.save.mockResolvedValue({ id: 'uuid', userId, streak: 1, timestamp: new Date() });

      const result = await service.dailyCheckIn(userId);

      expect(repo.create).toHaveBeenCalledWith({ userId, streak: 1 });
      expect(result.streak).toBe(1);
    });
  });
});