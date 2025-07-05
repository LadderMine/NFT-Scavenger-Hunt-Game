import { Test, TestingModule } from '@nestjs/testing';
import { UserActivityLogController } from './user-activity-log.controller';

describe('UserActivityLogController', () => {
  let controller: UserActivityLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserActivityLogController],
    }).compile();

    controller = module.get<UserActivityLogController>(UserActivityLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
