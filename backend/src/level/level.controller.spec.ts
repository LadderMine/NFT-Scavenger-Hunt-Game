import { Test, TestingModule } from '@nestjs/testing';
import { LevelController } from './level.controller';
import { LevelService } from './level.service';

describe('LevelController', () => {
  let controller: LevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelController],
      providers: [LevelService],
    }).compile();

    controller = module.get<LevelController>(LevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
