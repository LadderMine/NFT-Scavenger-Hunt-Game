/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLoggingService } from './error-logging.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErrorLog, ErrorLevel } from './entities/error-log.entity';
import { Repository } from 'typeorm';

const mockErrorLogRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn()
  }),
});

describe('ErrorLoggingService', () => {
  let service: ErrorLoggingService;
  let repository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorLoggingService,
        {
          provide: getRepositoryToken(ErrorLog),
          useFactory: mockErrorLogRepository,
        },
      ],
    }).compile();

    service = module.get<ErrorLoggingService>(ErrorLoggingService);
    repository = module.get(getRepositoryToken(ErrorLog));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logError', () => {
    it('should create and save an error log', async () => {
      const errorLogDto = {
        message: 'Test error',
        stackTrace: 'Error stack trace',
        context: 'TestService.method',
        level: ErrorLevel.ERROR,
      };
      const errorLogEntity = { ...errorLogDto, id: 'uuid', timestamp: new Date() };
      
      repository.create.mockReturnValue(errorLogEntity);
      repository.save.mockResolvedValue(errorLogEntity);

      const result = await service.logError(errorLogDto);
      
      expect(repository.create).toHaveBeenCalledWith({
        message: errorLogDto.message,
        stackTrace: errorLogDto.stackTrace,
        context: errorLogDto.context,
        level: errorLogDto.level,
      });
      expect(repository.save).toHaveBeenCalledWith(errorLogEntity);
      expect(result).toEqual(errorLogEntity);
    });

    it('should use default ERROR level if not specified', async () => {
      const errorLogDto = {
        message: 'Test error',
        stackTrace: 'Error stack trace',
        context: 'TestService.method',
      };
      const errorLogEntity = { 
        ...errorLogDto, 
        level: ErrorLevel.ERROR,
        id: 'uuid', 
        timestamp: new Date() 
      };
      
      repository.create.mockReturnValue(errorLogEntity);
      repository.save.mockResolvedValue(errorLogEntity);

      await service.logError(errorLogDto);
      
      expect(repository.create).toHaveBeenCalledWith({
        message: errorLogDto.message,
        stackTrace: errorLogDto.stackTrace,
        context: errorLogDto.context,
        level: ErrorLevel.ERROR,
      });
    });
  });

  describe('getRecentErrors', () => {
    it('should return recent errors with default limit', async () => {
      const mockLogs = [
        { id: '1', message: 'Error 1', context: 'TestService', level: ErrorLevel.ERROR },
        { id: '2', message: 'Error 2', context: 'TestService', level: ErrorLevel.ERROR },
      ];
      
      const queryBuilder = repository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockLogs);

      const result = await service.getRecentErrors({});
      
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(result).toEqual(mockLogs);
    });

    it('should filter by level if specified', async () => {
      const mockLogs = [
        { id: '1', message: 'Warning 1', context: 'TestService', level: ErrorLevel.WARNING },
      ];
      
      const queryBuilder = repository.createQueryBuilder();
      queryBuilder.getMany.mockResolvedValue(mockLogs);

      await service.getRecentErrors({ level: ErrorLevel.WARNING, limit: 5 });
      
      expect(queryBuilder.take).toHaveBeenCalledWith(5);
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('error_log.level = :level', { level: ErrorLevel.WARNING });
    });
  });

  describe('logErrorAsync', () => {
    it('should call repository.save without awaiting', async () => {
      const message = 'Async error';
      const stackTrace = 'Error stack trace';
      const context = 'TestService.method';
      const level = ErrorLevel.WARNING;
      
      const errorLogEntity = { 
        message, 
        stackTrace, 
        context, 
        level,
        id: 'uuid', 
        timestamp: new Date() 
      };
      
      repository.create.mockReturnValue(errorLogEntity);
      repository.save.mockResolvedValue(errorLogEntity);

      service.logErrorAsync(message, stackTrace, context, level);
      
      expect(repository.create).toHaveBeenCalledWith({
        message,
        stackTrace,
        context,
        level,
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should use default values if not provided', () => {
      const message = 'Async error';
      const errorLogEntity = { 
        message, 
        stackTrace: undefined, 
        context: 'Unknown', 
        level: ErrorLevel.ERROR,
        id: 'uuid', 
        timestamp: new Date() 
      };
      
      repository.create.mockReturnValue(errorLogEntity);
      repository.save.mockResolvedValue(errorLogEntity);

      service.logErrorAsync(message);
      
      expect(repository.create).toHaveBeenCalledWith({
        message,
        stackTrace: undefined,
        context: 'Unknown',
        level: ErrorLevel.ERROR,
      });
    });
  });
}); 