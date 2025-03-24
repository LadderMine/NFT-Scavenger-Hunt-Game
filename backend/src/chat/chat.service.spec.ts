import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository, In } from 'typeorm';
import { ChatService } from './chat.service';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import {
  MessageReceipt,
  ReceiptStatus,
} from './entities/message-receipt.entity';
import { User } from './entities/user.entity';
import { EventsGateway } from './events/events.gateway';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getRawMany: jest.fn(),
  })),
});

describe('ChatService', () => {
  let service: ChatService;
  let conversationRepository: MockRepository<Conversation>;
  let messageRepository: MockRepository<Message>;
  let receiptRepository: MockRepository<MessageReceipt>;
  let userRepository: MockRepository<User>;
  let eventsGateway: Partial<EventsGateway>;

  beforeEach(async () => {
    conversationRepository = createMockRepository();
    messageRepository = createMockRepository();
    receiptRepository = createMockRepository();
    userRepository = createMockRepository();
    eventsGateway = {
      sendEvent: jest.fn(),
      sendToConversation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getRepositoryToken(Conversation),
          useValue: conversationRepository,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: messageRepository,
        },
        {
          provide: getRepositoryToken(MessageReceipt),
          useValue: receiptRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: EventsGateway,
          useValue: eventsGateway,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createConversation', () => {
    it('should create a new group conversation', async () => {
      // Arrange
      const userId = 'user1';
      const createConversationDto = {
        name: 'Test Group',
        type: ConversationType.GROUP,
        participantIds: ['user1', 'user2', 'user3'],
      };

      const users = [
        { id: 'user1', username: 'user1' },
        { id: 'user2', username: 'user2' },
        { id: 'user3', username: 'user3' },
      ];

      const savedConversation = {
        id: 'conv1',
        ...createConversationDto,
        participants: users,
      };

      userRepository.find.mockResolvedValue(users);
      conversationRepository.create.mockReturnValue(savedConversation);
      conversationRepository.save.mockResolvedValue(savedConversation);

      // Act
      const result = await service.createConversation(
        createConversationDto,
        userId,
      );

      // Assert
      expect(userRepository.find).toHaveBeenCalled();
      expect(conversationRepository.create).toHaveBeenCalled();
      expect(conversationRepository.save).toHaveBeenCalled();
      expect(eventsGateway.sendEvent).toHaveBeenCalledTimes(2); // Should notify other 2 participants
      expect(result).toEqual(savedConversation);
    });

    it('should return existing direct conversation if it exists', async () => {
      // Arrange
      const userId = 'user1';
      const createConversationDto = {
        type: ConversationType.DIRECT,
        participantIds: ['user1', 'user2'],
      };

      const existingConversation = {
        id: 'conv1',
        type: ConversationType.DIRECT,
        participants: [
          { id: 'user1', username: 'user1' },
          { id: 'user2', username: 'user2' },
        ],
      };

      jest
        .spyOn(service, 'findDirectConversation')
        .mockResolvedValue('ff' as any);

      // Act
      const result = await service.createConversation(
        createConversationDto,
        userId,
      );

      // Assert
      expect(service.findDirectConversation).toHaveBeenCalledWith(
        'user1',
        'user2',
      );
      expect(result).toEqual(existingConversation);
    });

    it('should throw BadRequestException if direct conversation has more than 2 participants', async () => {
      // Arrange
      const userId = 'user1';
      const createConversationDto = {
        type: ConversationType.DIRECT,
        participantIds: ['user1', 'user2', 'user3'],
      };

      // Act & Assert
      await expect(
        service.createConversation(createConversationDto, userId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllMessages', () => {
    it('should return messages and update receipts', async () => {
      // Arrange
      const conversationId = 'conv1';
      const userId = 'user1';
      const paginationQuery = { limit: 20, offset: 0 };

      const conversation = {
        id: conversationId,
        participants: [{ id: 'user1' }, { id: 'user2' }],
      };

      const messages = [
        {
          id: 'msg1',
          content: 'Hello',
          senderId: 'user2',
          receipts: [
            {
              id: 'receipt1',
              userId: 'user1',
              status: ReceiptStatus.DELIVERED,
            },
          ],
        },
        {
          id: 'msg2',
          content: 'Hi there',
          senderId: 'user1',
          receipts: [
            { id: 'receipt2', userId: 'user2', status: ReceiptStatus.SENT },
          ],
        },
      ];

      jest
        .spyOn(service, 'findOneConversation')
        .mockResolvedValue(conversation as any);
      messageRepository.find.mockResolvedValue(messages);

      // Act
      const result = await service.findAllMessages(
        conversationId,
        userId,
        paginationQuery,
      );

      // Assert
      expect(service.findOneConversation).toHaveBeenCalledWith(
        conversationId,
        userId,
      );
      expect(messageRepository.find).toHaveBeenCalled();
      expect(receiptRepository.update).toHaveBeenCalledWith(
        { id: In(['receipt1']) },
        { status: ReceiptStatus.READ, readAt: expect.any(Date) },
      );
      expect(eventsGateway.sendEvent).toHaveBeenCalledWith(
        'user2',
        'receipt:updated',
        expect.any(Object),
      );
      expect(result).toEqual(messages);
    });
  });

  describe('updateMessage', () => {
    it('should update a message', async () => {
      // Arrange
      const messageId = 'msg1';
      const userId = 'user1';
      const updateMessageDto = {
        content: 'Updated content',
        conversationId: 'conv1',
      };

      const message = {
        id: messageId,
        content: 'Original content',
        senderId: userId,
        conversation: {
          id: 'conv1',
          participants: [{ id: 'user1' }, { id: 'user2' }],
        },
        isDeleted: false,
      };

      const updatedMessage = {
        ...message,
        content: updateMessageDto.content,
        isEdited: true,
        editedAt: expect.any(Date),
      };

      messageRepository.findOne.mockResolvedValue(message);
      messageRepository.save.mockResolvedValue(updatedMessage);

      // Act
      const result = await service.updateMessage(
        messageId,
        updateMessageDto as any,
        userId,
      );

      // Assert
      expect(messageRepository.findOne).toHaveBeenCalled();
      expect(messageRepository.save).toHaveBeenCalled();
      expect(eventsGateway.sendEvent).toHaveBeenCalledWith(
        'user2',
        'message:updated',
        updatedMessage,
      );
      expect(result).toEqual(updatedMessage);
    });

    it('should throw ForbiddenException if user is not the sender', async () => {
      // Arrange
      const messageId = 'msg1';
      const userId = 'user1';
      const updateMessageDto = {
        content: 'Updated content',
        conversationId: 'conv1',
      };

      const message = {
        id: messageId,
        content: 'Original content',
        senderId: 'user2', // Different user
        conversation: {
          id: 'conv1',
          participants: [{ id: 'user1' }, { id: 'user2' }],
        },
      };

      messageRepository.findOne.mockResolvedValue(message);

      // Act & Assert
      await expect(
        service.updateMessage(messageId, updateMessageDto as any, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread message counts', async () => {
      // Arrange
      const userId = 'user1';
      const unreadCounts = [
        { conversationId: 'conv1', count: '3' },
        { conversationId: 'conv2', count: '1' },
      ];

      const queryBuilder = receiptRepository.createQueryBuilder();
      queryBuilder.getRawMany.mockResolvedValue(unreadCounts);

      // Act
      const result = await service.getUnreadCount(userId);

      // Assert
      expect(receiptRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual({
        total: 4,
        byConversation: {
          conv1: 3,
          conv2: 1,
        },
      });
    });
  });
});
