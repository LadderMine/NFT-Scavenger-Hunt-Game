import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityLogService } from './user-activity-log.service';

describe('UserActivityLogService', () => {
  let service: UserActivityLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserActivityLogService],
    }).compile();

    service = module.get<UserActivityLogService>(UserActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
