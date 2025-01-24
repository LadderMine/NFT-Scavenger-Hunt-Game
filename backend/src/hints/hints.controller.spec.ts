import { Test, TestingModule } from '@nestjs/testing';
import { HintsController } from './hints.controller';

describe('HintsController', () => {
  let controller: HintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HintsController],
    }).compile();

    controller = module.get<HintsController>(HintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
