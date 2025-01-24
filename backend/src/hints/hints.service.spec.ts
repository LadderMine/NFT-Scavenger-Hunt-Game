import { Test, TestingModule } from '@nestjs/testing';
import { HintsService } from './hints.service';

describe('HintsService', () => {
  let service: HintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HintsService],
    }).compile();

    service = module.get<HintsService>(HintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
