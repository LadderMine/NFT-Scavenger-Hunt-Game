import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

describe('ContentService', () => {
  let service: ContentService;
  let repository: Repository<Content>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockContent: Content = {
    id: 'test-id',
    title: 'Test Content',
    body: 'Test body content',
    topic: 'test-topic',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: getRepositoryToken(Content),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    repository = module.get<Repository<Content>>(getRepositoryToken(Content));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new content', async () => {
      const createDto: CreateContentDto = {
        title: 'New Content',
        body: 'New body content',
        topic: 'new-topic',
      };

      mockRepository.create.mockReturnValue(mockContent);
      mockRepository.save.mockResolvedValue(mockContent);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockContent);
      expect(result).toEqual(mockContent);
    });
  });

  describe('findAll', () => {
    it('should return all active content', async () => {
      const mockContents = [mockContent];
      mockRepository.find.mockResolvedValue(mockContents);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockContents);
    });
  });

  describe('findAllByTopic', () => {
    it('should return content filtered by topic', async () => {
      const topic = 'blockchain';
      const mockContents = [mockContent];
      mockRepository.find.mockResolvedValue(mockContents);

      const result = await service.findAllByTopic(topic);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { topic, isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockContents);
    });
  });

  describe('findOne', () => {
    it('should return content by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockContent);

      const result = await service.findOne('test-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id', isActive: true },
      });
      expect(result).toEqual(mockContent);
    });

    it('should throw NotFoundException when content not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update content', async () => {
      const updateDto: UpdateContentDto = {
        title: 'Updated Title',
      };

      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.save.mockResolvedValue({ ...mockContent, ...updateDto });

      const result = await service.update('test-id', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockContent,
        ...updateDto,
      });
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException when updating non-existent content', async () => {
      const updateDto: UpdateContentDto = {
        title: 'Updated Title',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove content', async () => {
      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.remove.mockResolvedValue(mockContent);

      await service.remove('test-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockContent);
    });

    it('should throw NotFoundException when removing non-existent content', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllAdmin', () => {
    it('should return all content including inactive', async () => {
      const mockContents = [mockContent];
      mockRepository.find.mockResolvedValue(mockContents);

      const result = await service.findAllAdmin();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockContents);
    });
  });

  describe('findOneAdmin', () => {
    it('should return content by id including inactive', async () => {
      mockRepository.findOne.mockResolvedValue(mockContent);

      const result = await service.findOneAdmin('test-id');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'test-id' },
      });
      expect(result).toEqual(mockContent);
    });

    it('should throw NotFoundException when content not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneAdmin('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateAdmin', () => {
    it('should update content as admin', async () => {
      const updateDto: UpdateContentDto = {
        title: 'Updated Title',
      };

      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.save.mockResolvedValue({ ...mockContent, ...updateDto });

      const result = await service.updateAdmin('test-id', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockContent,
        ...updateDto,
      });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('removeAdmin', () => {
    it('should remove content as admin', async () => {
      mockRepository.findOne.mockResolvedValue(mockContent);
      mockRepository.remove.mockResolvedValue(mockContent);

      await service.removeAdmin('test-id');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockContent);
    });
  });
}); 