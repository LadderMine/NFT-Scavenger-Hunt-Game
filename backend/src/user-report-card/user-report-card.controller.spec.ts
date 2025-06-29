import { Test, TestingModule } from '@nestjs/testing';
import { UserReportCardController } from './user-report-card.controller';
import { UserReportCardService } from './user-report-card.service';

describe('UserReportCardController', () => {
  let controller: UserReportCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReportCardController],
      providers: [UserReportCardService],
    }).compile();

    controller = module.get<UserReportCardController>(UserReportCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
