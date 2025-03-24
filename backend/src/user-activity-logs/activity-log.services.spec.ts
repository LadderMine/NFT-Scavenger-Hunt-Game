import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsService } from './user-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './user-activity.entity';

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;
  let repository: Repository<ActivityLog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: getRepositoryToken(ActivityLog),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ActivityLogsService>(ActivityLogsService);
    repository = module.get<Repository<ActivityLog>>(
      getRepositoryToken(ActivityLog),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log an activity', async () => {
    const logData = {
      userId: '123',
      action: 'Test Action',
      metadata: { key: 'value' },
    };
    jest.spyOn(repository, 'save').mockResolvedValue(logData as any);
    expect(
      await service.logActivity(
        logData.userId,
        // logData.action,
        // logData.metadata,
      ),
    ).toEqual(logData);
  });
});
