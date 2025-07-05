import { Test, TestingModule } from '@nestjs/testing';
import { ContentRatingController } from './content-rating.controller';

describe('ContentRatingController', () => {
  let controller: ContentRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentRatingController],
    }).compile();

    controller = module.get<ContentRatingController>(ContentRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
