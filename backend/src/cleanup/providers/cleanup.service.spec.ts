import { Test, TestingModule } from '@nestjs/testing';
import { CleanupService } from './cleanup.service';

describe('CleanupService', () => {
  let service: CleanupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CleanupService],
    }).compile();

    service = module.get<CleanupService>(CleanupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
