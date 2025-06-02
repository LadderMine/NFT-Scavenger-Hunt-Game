import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSettingsController } from './notification-settings.controller';
import { NotificationSettingsService } from './notification-settings.service';

describe('NotificationSettingsController', () => {
  let controller: NotificationSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationSettingsController],
      providers: [NotificationSettingsService],
    }).compile();

    controller = module.get<NotificationSettingsController>(NotificationSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
