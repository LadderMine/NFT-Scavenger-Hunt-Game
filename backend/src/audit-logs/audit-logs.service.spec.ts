/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// Remove the unused Repository import
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './entities/audit-log.entity';

describe('AuditLogsService', () => {
  let service: AuditLogsService;
  // Remove the unused repository variable

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
    // Remove the repository assignment
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an audit log', async () => {
      const createAuditLogDto = {
        eventType: 'USER_AUTHENTICATION',
        userId: 'user-123',
        username: 'testuser',
        ipAddress: '127.0.0.1',
        action: 'LOGIN',
        status: 'SUCCESS',
      };

      const auditLog = {
        id: 'log-123',
        ...createAuditLogDto,
        timestamp: new Date(),
      };

      mockRepository.create.mockReturnValue(auditLog);
      mockRepository.save.mockResolvedValue(auditLog);

      const result = await service.create(createAuditLogDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createAuditLogDto);
      expect(mockRepository.save).toHaveBeenCalledWith(auditLog);
      expect(result).toEqual(auditLog);
    });
  });

  describe('findAll', () => {
    it('should return paginated audit logs', async () => {
      const queryParams = {
        page: '1',
        limit: '10',
        eventType: 'USER_AUTHENTICATION',
      };

      const auditLogs = [
        {
          id: 'log-1',
          eventType: 'USER_AUTHENTICATION',
          timestamp: new Date(),
        },
        {
          id: 'log-2',
          eventType: 'USER_AUTHENTICATION',
          timestamp: new Date(),
        },
      ];

      mockRepository.findAndCount.mockResolvedValue([auditLogs, 2]);

      const result = await service.findAll(queryParams);

      expect(mockRepository.findAndCount).toHaveBeenCalled();
      expect(result).toEqual({
        data: auditLogs,
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single audit log by id', async () => {
      const id = 'log-123';
      const auditLog = {
        id,
        eventType: 'USER_AUTHENTICATION',
        timestamp: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(auditLog);

      const result = await service.findOne(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(auditLog);
    });
  });

  describe('helper methods', () => {
    it('should log user login', async () => {
      const userId = 'user-123';
      const username = 'testuser';
      const ipAddress = '127.0.0.1';
      const success = true;

      const auditLog = {
        id: 'log-123',
        eventType: 'USER_AUTHENTICATION',
        userId,
        username,
        ipAddress,
        action: 'LOGIN',
        status: 'SUCCESS',
        resource: 'USER',
        resourceId: userId,
        timestamp: new Date(),
      };

      mockRepository.create.mockReturnValue(auditLog);
      mockRepository.save.mockResolvedValue(auditLog);

      const result = await service.logUserLogin(
        userId,
        username,
        ipAddress,
        success,
      );

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(auditLog);
    });
  });
});
