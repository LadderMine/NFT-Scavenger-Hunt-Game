import { Test, TestingModule } from '@nestjs/testing';
import { PuzzleVersioningController } from './puzzle-versioning.controller';
import { PuzzleVersioningService } from './puzzle-versioning.service';
import { CreatePuzzleVersionDto } from './dto/create-puzzle-version.dto';

describe('PuzzleVersioningController', () => {
  let controller: PuzzleVersioningController;
  let service: PuzzleVersioningService;

  const mockPuzzleVersioningService = {
    findLatestVersion: jest.fn(),
    createNewVersion: jest.fn(),
    findAllVersions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuzzleVersioningController],
      providers: [
        {
          provide: PuzzleVersioningService,
          useValue: mockPuzzleVersioningService,
        },
      ],
    }).compile();

    controller = module.get<PuzzleVersioningController>(PuzzleVersioningController);
    service = module.get<PuzzleVersioningService>(PuzzleVersioningService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findLatestVersion', () => {
    it('should call the service to find the latest version of a puzzle', async () => {
      const puzzleId = 'puzzle-123';
      await controller.findLatestVersion(puzzleId);
      expect(service.findLatestVersion).toHaveBeenCalledWith(puzzleId);
    });
  });

  describe('createNewVersion', () => {
    it('should call the service to create a new puzzle version', async () => {
      const dto: CreatePuzzleVersionDto = {
        puzzleId: 'puzzle-123',
        title: 'New Title',
        content: { data: 'some content' },
      };
      await controller.createNewVersion(dto);
      expect(service.createNewVersion).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllVersions', () => {
    it('should call the service to find all versions of a puzzle', async () => {
      const puzzleId = 'puzzle-123';
      await controller.findAllVersions(puzzleId);
      expect(service.findAllVersions).toHaveBeenCalledWith(puzzleId);
    });
  });
});