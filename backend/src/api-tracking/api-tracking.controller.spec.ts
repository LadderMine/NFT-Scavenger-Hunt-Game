import { Test, TestingModule } from '@nestjs/testing';
import { ApiTrackingController } from './api-tracking.controller';
import { ApiTrackingService } from './api-tracking.service';

describe('ApiTrackingController', () => {
  let controller: ApiTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTrackingController],
      providers: [ApiTrackingService],
    }).compile();

    controller = module.get<ApiTrackingController>(ApiTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
