import { Test, TestingModule } from '@nestjs/testing';
import { AchievementController } from './achievements.controller';
import { AchievementService } from './achievements.service';

describe('AchievementsController', () => {
  let controller: AchievementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
      providers: [AchievementService],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
