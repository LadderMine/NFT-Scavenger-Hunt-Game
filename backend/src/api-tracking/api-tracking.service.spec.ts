import { Test, TestingModule } from '@nestjs/testing';
import { ApiTrackingService } from './api-tracking.service';
import { beforeEach, expect } from '@jest/globals';

describe('ApiTrackingService', () => {
  let service: ApiTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTrackingService],
    }).compile();

    service = module.get<ApiTrackingService>(ApiTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
