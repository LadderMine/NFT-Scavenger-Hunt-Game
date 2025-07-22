import { Test, TestingModule } from '@nestjs/testing';
import { DailyRewardController } from './daily-reward.controller';
import { DailyRewardService } from './daily-reward.service';
import { DailyCheckinDto } from './dto/daily-checkin.dto';

describe('DailyRewardController', () => {
  let controller: DailyRewardController;
  let service: DailyRewardService;

  const mockDailyRewardService = {
    dailyCheckIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyRewardController],
      providers: [
        {
          provide: DailyRewardService,
          useValue: mockDailyRewardService,
        },
      ],
    }).compile();

    controller = module.get<DailyRewardController>(DailyRewardController);
    service = module.get<DailyRewardService>(DailyRewardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('dailyCheckIn', () => {
    it('should call the dailyCheckIn service with the correct userId', async () => {
      const dto: DailyCheckinDto = { userId: 'user-123' };
      const expectedResult = { id: 'uuid', userId: dto.userId, streak: 1, timestamp: new Date() };
      mockDailyRewardService.dailyCheckIn.mockResolvedValue(expectedResult);

      const result = await controller.dailyCheckIn(dto);

      expect(service.dailyCheckIn).toHaveBeenCalledWith(dto.userId);
      expect(result).toEqual(expectedResult);
    });
  });
});