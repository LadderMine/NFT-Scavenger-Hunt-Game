import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';

describe('AchievementsController', () => {
  let controller: AchievementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementsController],
      providers: [AchievementsService],
    }).compile();

    controller = module.get<AchievementsController>(AchievementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
