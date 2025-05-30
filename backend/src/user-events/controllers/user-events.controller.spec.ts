import { Test, TestingModule } from '@nestjs/testing';
import { UserEventsController } from './user-events.controller';
import { UserEventsService } from './user-events.service';

describe('UserEventsController', () => {
  let controller: UserEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEventsController],
      providers: [UserEventsService],
    }).compile();

    controller = module.get<UserEventsController>(UserEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
