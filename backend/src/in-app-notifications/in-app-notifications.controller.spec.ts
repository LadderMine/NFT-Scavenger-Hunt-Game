import { Test, TestingModule } from '@nestjs/testing';
import { InAppNotificationsController } from './in-app-notifications.controller';
import { InAppNotificationsService } from './in-app-notifications.service';

describe('InAppNotificationsController', () => {
  let controller: InAppNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InAppNotificationsController],
      providers: [InAppNotificationsService],
    }).compile();

    controller = module.get<InAppNotificationsController>(InAppNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
