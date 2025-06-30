import { Test, TestingModule } from '@nestjs/testing';
import { UserReportCardService } from './user-report-card.service';

describe('UserReportCardService', () => {
  let service: UserReportCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserReportCardService],
    }).compile();

    service = module.get<UserReportCardService>(UserReportCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
