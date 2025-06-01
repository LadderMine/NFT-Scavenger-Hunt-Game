import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InAppNotificationsService } from './in-app-notifications.service';
import { InAppNotification, InAppNotificationType } from './entities/in-app-notification.entity';
import { UsersService } from '../users/users.service';
import { InAppNotificationsGateway } from './in-app-notifications.gateway';
import { NotFoundException } from '@nestjs/common';

describe('InAppNotificationsService', () => {
  let service: InAppNotificationsService;
  let repository: Repository<InAppNotification>;
  let usersService: UsersService;
  let gateway: InAppNotificationsGateway;

  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  const mockNotification = {
    id: 1,
    userId: 1,
    title: 'Test Notification',
    message: 'Test Message',
    type: InAppNotificationType.GENERAL,
    isRead: false,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InAppNotificationsService,
        {
          provide: getRepositoryToken(InAppNotification),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: InAppNotificationsGateway,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InAppNotificationsService>(InAppNotificationsService);
    repository = module.get<Repository<InAppNotification>>(getRepositoryToken(InAppNotification));
    usersService = module.get<UsersService>(UsersService);
    gateway = module.get<InAppNotificationsGateway>(InAppNotificationsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification successfully', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(repository, 'create').mockReturnValue(mockNotification as any);
      jest.spyOn(repository, 'save').mockResolvedValue(mockNotification as any);

      const result = await service.create({
        userId: 1,
        title: 'Test Notification',
        message: 'Test Message',
      });

      expect(result).toEqual(mockNotification);
      expect(usersService.findById).toHaveBeenCalledWith(1);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(gateway.sendNotification).toHaveBeenCalledWith(1, mockNotification);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      await expect(
        service.create({
          userId: 999,
          title: 'Test Notification',
          message: 'Test Message',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserNotifications', () => {
    it('should return filtered notifications', async () => {
      const mockNotifications = [mockNotification];
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockNotifications),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getUserNotifications(1, {
        isRead: false,
        type: InAppNotificationType.GENERAL,
        limit: 10,
        offset: 0,
      });

      expect(result).toEqual(mockNotifications);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('notification.userId = :userId', { userId: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });

  describe('markAsRead', () => {
    it('should mark notifications as read', async () => {
      const now = new Date();
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);

      const result = await service.markAsRead({ notificationIds: [1, 2] });

      expect(result).toEqual({ success: true, readAt: expect.any(Date) });
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a notification', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockNotification as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockNotification as any);

      const result = await service.delete(1, 1);

      expect(result).toEqual(mockNotification);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockNotification);
    });

    it('should throw NotFoundException when notification not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(999, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(5);

      const result = await service.getUnreadCount(1);

      expect(result).toBe(5);
      expect(repository.count).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false, isArchived: false },
      });
    });
  });

  describe('createSystemNotification', () => {
    it('should create system-wide notifications', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers as any);
      jest.spyOn(service, 'create').mockResolvedValue(mockNotification as any);

      const result = await service.createSystemNotification(
        'System Notification',
        'System Message',
        InAppNotificationType.SYSTEM
      );

      expect(result).toEqual([mockNotification]);
      expect(usersService.findAll).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        title: 'System Notification',
        message: 'System Message',
        type: InAppNotificationType.SYSTEM,
        priority: 5,
      });
    });
  });
});
