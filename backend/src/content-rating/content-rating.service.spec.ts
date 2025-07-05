import { Test, TestingModule } from '@nestjs/testing';
import { ContentRatingService } from './content-rating.service';

describe('ContentRatingService', () => {
  let service: ContentRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentRatingService],
    }).compile();

    service = module.get<ContentRatingService>(ContentRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
