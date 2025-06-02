import { Test, TestingModule } from '@nestjs/testing';
import { NotificationSettingsService } from './notification-settings.service';

describe('NotificationSettingsService', () => {
  let service: NotificationSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationSettingsService],
    }).compile();

    service = module.get<NotificationSettingsService>(NotificationSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
