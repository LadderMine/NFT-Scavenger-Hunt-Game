import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type Repository, In, Not, LessThan } from 'typeorm';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { Message, MessageType } from './entities/message.entity';
import {
  MessageReceipt,
  ReceiptStatus,
} from './entities/message-receipt.entity';
import { User } from './entities/user.entity';
import {
  ConversationRole,
  ConversationRoleType,
} from './entities/conversation-role.entity';
import { MessageReaction } from './entities/message-reaction.entity';
import { PinnedMessage } from './entities/pinned-message.entity';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { PollVote } from './entities/poll-vote.entity';
import { GameInvite, GameInviteStatus } from './entities/game-invite.entity';
import { SharedGameItem } from './entities/shared-game-item.entity';
import type { CreateConversationDto } from './dto/create-conversation.dto';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { UpdateMessageReceiptDto } from './dto/update-message-receipt.dto';
import type { UpdateConversationRoleDto } from './dto/update-conversation-role.dto';
import type { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import type { CreatePollVoteDto } from './dto/create-poll-vote.dto';
import type { PaginationQueryDto } from './common/dto/pagination-query.dto';
import type { EventsGateway } from './events/events.gateway';
import { ModeratorService } from './providers/moderator.service';
import { TranslationService } from './providers/translation.service';
import { AnalyticsService } from './providers/analytics.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageReceipt)
    private readonly receiptRepository: Repository<MessageReceipt>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ConversationRole)
    private readonly roleRepository: Repository<ConversationRole>,
    @InjectRepository(MessageReaction)
    private readonly reactionRepository: Repository<MessageReaction>,
    @InjectRepository(PinnedMessage)
    private readonly pinnedMessageRepository: Repository<PinnedMessage>,
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionRepository: Repository<PollOption>,
    @InjectRepository(PollVote)
    private readonly pollVoteRepository: Repository<PollVote>,
    @InjectRepository(GameInvite)
    private readonly gameInviteRepository: Repository<GameInvite>,
    @InjectRepository(SharedGameItem)
    private readonly sharedGameItemRepository: Repository<SharedGameItem>,
    private readonly eventsGateway: EventsGateway,
    private readonly moderatorService: ModeratorService,
    private readonly translationService: TranslationService,
    private readonly analyticsService: AnalyticsService,
    private readonly createSystemMessage,
  ) {}

  // Conversation methods
  async createConversation(
    createConversationDto: CreateConversationDto,
    userId: string,
  ): Promise<Conversation> {
    const {
      participantIds,
      adminIds = [],
      ...conversationData
    } = createConversationDto;

    // Ensure creator is included in participants
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }

    // For direct messages, ensure only 2 participants
    if (
      conversationData.type === ConversationType.DIRECT &&
      participantIds.length !== 2
    ) {
      throw new BadRequestException(
        'Direct conversations must have exactly 2 participants',
      );
    }

    // Check if direct conversation already exists between these users
    if (conversationData.type === ConversationType.DIRECT) {
      const existingConversation = await this.findDirectConversation(
        participantIds[0],
        participantIds[1],
      );
      if (existingConversation) {
        return existingConversation;
      }
    }

    // Check if max participants is valid
    if (
      conversationData.maxParticipants &&
      participantIds.length > conversationData.maxParticipants
    ) {
      throw new BadRequestException(
        `Number of participants exceeds the maximum limit of ${conversationData.maxParticipants}`,
      );
    }

    const participants = await this.userRepository.find({
      where: { id: In(participantIds) },
    });

    if (participants.length !== participantIds.length) {
      throw new BadRequestException('One or more participants not found');
    }

    const conversation = this.conversationRepository.create({
      ...conversationData,
      participants,
    });

    const savedConversation =
      await this.conversationRepository.save(conversation);

    // Create roles for participants
    const roles = [];

    // Creator is always an owner
    roles.push(
      this.roleRepository.create({
        conversation: savedConversation,
        user: participants.find((p) => p.id === userId),
        role: ConversationRoleType.OWNER,
      }),
    );

    // Set admins
    for (const adminId of adminIds) {
      if (adminId !== userId && participantIds.includes(adminId)) {
        roles.push(
          this.roleRepository.create({
            conversation: savedConversation,
            user: participants.find((p) => p.id === adminId),
            role: ConversationRoleType.ADMIN,
          }),
        );
      }
    }

    // Set regular members
    for (const participant of participants) {
      if (participant.id !== userId && !adminIds.includes(participant.id)) {
        roles.push(
          this.roleRepository.create({
            conversation: savedConversation,
            user: participant,
            role: ConversationRoleType.MEMBER,
          }),
        );
      }
    }

    await this.roleRepository.save(roles);

    // Create system message for group creation
    if (conversationData.type !== ConversationType.DIRECT) {
      await this.createSystemMessage(
        savedConversation.id,
        `${participants.find((p) => p.id === userId).username} created this ${conversationData.type.toLowerCase()}.`,
      );
    }

    // Notify all participants about the new conversation
    participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(
          participant.id,
          'conversation:created',
          savedConversation,
        );
      }
    });

    // Log analytics
    this.analyticsService.logConversationCreated(
      savedConversation.id,
      userId,
      conversationData.type,
    );

    return savedConversation;
  }

  async findDirectConversation(
    user1Id: string,
    user2Id: string,
  ): Promise<Conversation | null> {
    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participants')
      .where('conversation.type = :type', { type: ConversationType.DIRECT })
      .andWhere('participants.id IN (:...userIds)', {
        userIds: [user1Id, user2Id],
      })
      .groupBy('conversation.id')
      .having('COUNT(DISTINCT participants.id) = 2')
      .getMany();

    for (const conversation of conversations) {
      const participantIds = conversation.participants.map((p) => p.id);
      if (
        participantIds.includes(user1Id) &&
        participantIds.includes(user2Id)
      ) {
        return conversation;
      }
    }

    return null;
  }

  async findAllConversations(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Conversation[]> {
    const { limit = 10, offset = 0 } = paginationQuery;

    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoinAndSelect('conversation.participants', 'participants')
      .leftJoinAndSelect('conversation.messages', 'messages')
      .leftJoinAndSelect(
        'conversation.roles',
        'roles',
        'roles.userId = :userId',
        { userId },
      )
      .where('participants.id = :userId', { userId })
      .andWhere('conversation.isActive = :isActive', { isActive: true })
      .orderBy('messages.createdAt', 'DESC')
      .take(limit)
      .skip(offset)
      .getMany();

    // Get last message and unread count for each conversation
    const enhancedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await this.messageRepository.findOne({
          where: { conversationId: conversation.id, isDeleted: false },
          relations: ['sender'],
          order: { createdAt: 'DESC' },
        });

        const unreadCount = await this.receiptRepository.count({
          where: {
            message: {
              conversationId: conversation.id,
              senderId: Not(userId),
              isDeleted: false,
            },
            userId,
            status: Not(ReceiptStatus.READ),
          },
        });

        return {
          ...conversation,
          lastMessage,
          unreadCount,
        };
      }),
    );

    return enhancedConversations;
  }

  async findOneConversation(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: [
        'participants',
        'roles',
        'pinnedMessages',
        'pinnedMessages.message',
      ],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      // Check if it's a public conversation that the user can join
      if (conversation.isPublic) {
        return conversation;
      }
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    return conversation;
  }

  async updateConversation(
    id: string,
    updateConversationDto: Partial<CreateConversationDto>,
    userId: string,
  ): Promise<Conversation> {
    const conversation = await this.findOneConversation(id, userId);

    // Check if user has permission to update the conversation
    const userRole = await this.roleRepository.findOne({
      where: { conversationId: id, userId },
    });

    if (
      !userRole ||
      (userRole.role !== ConversationRoleType.OWNER &&
        userRole.role !== ConversationRoleType.ADMIN)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this conversation',
      );
    }

    // Don't allow changing the type of conversation
    if (
      updateConversationDto.type &&
      updateConversationDto.type !== conversation.type
    ) {
      throw new BadRequestException(
        'Cannot change the type of an existing conversation',
      );
    }

    // Update conversation properties
    Object.assign(conversation, updateConversationDto);

    const updatedConversation =
      await this.conversationRepository.save(conversation);

    // Create system message for the update
    await this.createSystemMessage(
      id,
      `${userRole.user.username} updated the conversation settings.`,
    );

    // Notify all participants
    conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(
          participant.id,
          'conversation:updated',
          updatedConversation,
        );
      }
    });

    return updatedConversation;
  }

  async removeConversation(id: string, userId: string): Promise<void> {
    const conversation = await this.findOneConversation(id, userId);

    // Check if user has permission to delete the conversation
    const userRole = await this.roleRepository.findOne({
      where: { conversationId: id, userId },
    });

    if (!userRole || userRole.role !== ConversationRoleType.OWNER) {
      throw new ForbiddenException(
        'Only the owner can delete this conversation',
      );
    }

    // Soft delete by setting isActive to false
    conversation.isActive = false;
    await this.conversationRepository.save(conversation);

    // Create system message
    await this.createSystemMessage(
      id,
      `${userRole.user.username} deleted this conversation.`,
    );

    // Notify all participants
    conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'conversation:removed', {
          id,
        });
      }
    });

    // Log analytics
    this.analyticsService.logConversationDeleted(id, userId);
  }

  async joinConversation(id: string, userId: string): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants'],
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    // Check if the conversation is public
    if (!conversation.isPublic) {
      throw new ForbiddenException('This conversation is not public');
    }

    // Check if user is already a participant
    const isParticipant = conversation.participants.some(
      (p) => p.id === userId,
    );
    if (isParticipant) {
      throw new ConflictException(
        'You are already a participant in this conversation',
      );
    }

    // Check if the conversation has reached its maximum participants
    if (
      conversation.maxParticipants > 0 &&
      conversation.participants.length >= conversation.maxParticipants
    ) {
      throw new BadRequestException(
        'This conversation has reached its maximum number of participants',
      );
    }

    // Add user to participants
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    conversation.participants.push(user);
    const updatedConversation =
      await this.conversationRepository.save(conversation);

    // Create role for the new participant
    await this.roleRepository.save(
      this.roleRepository.create({
        conversation,
        user,
        role: ConversationRoleType.MEMBER,
      }),
    );

    // Create system message
    await this.createSystemMessage(
      id,
      `${user.username} joined the conversation.`,
    );

    // Notify all participants
    conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(
          participant.id,
          'conversation:user_joined',
          {
            conversationId: id,
            user,
          },
        );
      }
    });

    // Log analytics
    this.analyticsService.logUserJoinedConversation(id, userId);

    return updatedConversation;
  }

  async leaveConversation(id: string, userId: string): Promise<void> {
    const conversation = await this.findOneConversation(id, userId);

    // Check if it's a direct conversation
    if (conversation.type === ConversationType.DIRECT) {
      throw new BadRequestException('Cannot leave a direct conversation');
    }

    // Check if user is the owner
    const userRole = await this.roleRepository.findOne({
      where: { conversationId: id, userId },
    });

    if (userRole && userRole.role === ConversationRoleType.OWNER) {
      // If the user is the owner, check if there are other admins
      const adminCount = await this.roleRepository.count({
        where: {
          conversationId: id,
          role: ConversationRoleType.ADMIN,
        },
      });

      if (adminCount === 0) {
        throw new BadRequestException(
          'As the owner, you must promote someone to admin before leaving',
        );
      }

      // Promote the first admin to owner
      const firstAdmin = await this.roleRepository.findOne({
        where: {
          conversationId: id,
          role: ConversationRoleType.ADMIN,
        },
        relations: ['user'],
      });

      firstAdmin.role = ConversationRoleType.OWNER;
      await this.roleRepository.save(firstAdmin);

      // Create system message for ownership transfer
      await this.createSystemMessage(
        id,
        `${userRole.user.username} transferred ownership to ${firstAdmin.user.username}.`,
      );
    }

    // Remove user from participants
    conversation.participants = conversation.participants.filter(
      (p) => p.id !== userId,
    );
    await this.conversationRepository.save(conversation);

    // Delete user's role
    if (userRole) {
      await this.roleRepository.remove(userRole);
    }

    // Get user for system message
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    // Create system message
    await this.createSystemMessage(
      id,
      `${user.username} left the conversation.`,
    );

    // Notify all participants
    conversation.participants.forEach((participant) => {
      this.eventsGateway.sendEvent(participant.id, 'conversation:user_left', {
        conversationId: id,
        userId,
      });
    });

    // Log analytics
    this.analyticsService.logUserLeftConversation(id, userId);
  }

  async updateConversationRole(
    id: string,
    updateRoleDto: UpdateConversationRoleDto,
    userId: string,
  ): Promise<ConversationRole> {
    const { userId: targetUserId, role: newRole } = updateRoleDto;

    // Check if conversation exists and user is a participant
    const conversation = await this.findOneConversation(id, userId);

    // Check if target user is a participant
    const isTargetParticipant = conversation.participants.some(
      (p) => p.id === targetUserId,
    );
    if (!isTargetParticipant) {
      throw new NotFoundException(
        'Target user is not a participant in this conversation',
      );
    }

    // Check if user has permission to update roles
    const userRole = await this.roleRepository.findOne({
      where: { conversationId: id, userId },
      relations: ['user'],
    });

    if (
      !userRole ||
      (userRole.role !== ConversationRoleType.OWNER &&
        userRole.role !== ConversationRoleType.ADMIN)
    ) {
      throw new ForbiddenException(
        'You do not have permission to update roles',
      );
    }

    // Admins can only update members, not other admins or the owner
    if (userRole.role === ConversationRoleType.ADMIN) {
      const targetRole = await this.roleRepository.findOne({
        where: { conversationId: id, userId: targetUserId },
      });

      if (
        targetRole &&
        (targetRole.role === ConversationRoleType.ADMIN ||
          targetRole.role === ConversationRoleType.OWNER)
      ) {
        throw new ForbiddenException(
          'Admins cannot modify other admins or the owner',
        );
      }

      // Admins cannot promote to owner
      if (newRole === ConversationRoleType.OWNER) {
        throw new ForbiddenException('Admins cannot promote users to owner');
      }
    }

    // Get or create role for target user
    let targetRole = await this.roleRepository.findOne({
      where: { conversationId: id, userId: targetUserId },
      relations: ['user'],
    });

    if (!targetRole) {
      const targetUser = await this.userRepository.findOne({
        where: { id: targetUserId },
      });

      targetRole = this.roleRepository.create({
        conversation,
        user: targetUser,
        role: newRole,
      });
    } else {
      // Cannot demote the owner
      if (targetRole.role === ConversationRoleType.OWNER) {
        throw new ForbiddenException(
          'Cannot change the role of the conversation owner',
        );
      }

      targetRole.role = newRole;
    }

    const savedRole = await this.roleRepository.save(targetRole);

    // If promoting to owner, demote current owner
    if (newRole === ConversationRoleType.OWNER) {
      userRole.role = ConversationRoleType.ADMIN;
      await this.roleRepository.save(userRole);

      // Create system message for ownership transfer
      await this.createSystemMessage(
        id,
        `${userRole.user.username} transferred ownership to ${targetRole.user.username}.`,
      );
    } else {
      // Create system message for role update
      await this.createSystemMessage(
        id,
        `${userRole.user.username} changed ${targetRole.user.username}'s role to ${newRole.toLowerCase()}.`,
      );
    }

    // Notify all participants
    conversation.participants.forEach((participant) => {
      this.eventsGateway.sendEvent(
        participant.id,
        'conversation:role_updated',
        {
          conversationId: id,
          userId: targetUserId,
          role: newRole,
        },
      );
    });

    return savedRole;
  }

  // Message methods
  async createMessage(
    createMessageDto: CreateMessageDto,
    senderId: string,
  ): Promise<Message> {
    const {
      conversationId,
      replyToId,
      poll,
      gameInvite,
      sharedGameItem,
      ...messageData
    } = createMessageDto;

    const conversation = await this.findOneConversation(
      conversationId,
      senderId,
    );

    // Check if conversation is read-only
    if (conversation.isReadOnly) {
      // Check if user is admin or owner
      const userRole = await this.roleRepository.findOne({
        where: { conversationId, userId: senderId },
      });

      if (
        !userRole ||
        (userRole.role !== ConversationRoleType.OWNER &&
          userRole.role !== ConversationRoleType.ADMIN)
      ) {
        throw new ForbiddenException('This conversation is read-only');
      }
    }

    // Check slow mode
    if (conversation.slowMode > 0) {
      const lastMessage = await this.messageRepository.findOne({
        where: {
          conversationId,
          senderId,
        },
        order: { createdAt: 'DESC' },
      });

      if (lastMessage) {
        const timeSinceLastMessage =
          Date.now() - lastMessage.createdAt.getTime();
        const slowModeMs = conversation.slowMode * 1000;

        if (timeSinceLastMessage < slowModeMs) {
          const waitTimeSeconds = Math.ceil(
            (slowModeMs - timeSinceLastMessage) / 1000,
          );
          throw new BadRequestException(
            `Slow mode is enabled. Please wait ${waitTimeSeconds} seconds before sending another message.`,
          );
        }
      }
    }

    // Check if media is allowed
    if (
      (messageData.type === MessageType.IMAGE ||
        messageData.type === MessageType.VIDEO ||
        messageData.type === MessageType.AUDIO ||
        messageData.type === MessageType.FILE) &&
      !conversation.allowsMedia
    ) {
      throw new ForbiddenException(
        'Media messages are not allowed in this conversation',
      );
    }

    // Check if replies are allowed
    if (replyToId && !conversation.allowsReplies) {
      throw new ForbiddenException(
        'Replies are not allowed in this conversation',
      );
    }

    let replyTo = null;
    if (replyToId) {
      replyTo = await this.messageRepository.findOne({
        where: { id: replyToId, conversationId },
      });

      if (!replyTo) {
        throw new NotFoundException('Reply message not found');
      }
    }

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException('Sender not found');
    }

    // Content moderation
    if (conversation.isModerated) {
      const moderationResult = await this.moderatorService.moderateContent(
        messageData.content,
      );

      if (!moderationResult.isAllowed) {
        throw new BadRequestException(
          `Message rejected: ${moderationResult.reason}`,
        );
      }
    }

    // Handle scheduled messages
    if (messageData.isScheduled && messageData.scheduledFor) {
      // Validate scheduled time is in the future
      if (new Date(messageData.scheduledFor) <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }

      // Create the message but don't send it yet
      const message = this.messageRepository.create({
        ...messageData,
        conversation,
        sender,
        replyTo,
      });

      const savedMessage = await this.messageRepository.save(message);

      // Schedule the message to be sent later
      // This would typically be handled by a job scheduler like Bull
      // For simplicity, we'll just return the saved message
      return savedMessage;
    }

    // Create the message
    const message = this.messageRepository.create({
      ...messageData,
      conversation,
      sender,
      replyTo,
    });

    const savedMessage = await this.messageRepository.save(message);

    // Create receipts for all participants
    const receipts = conversation.participants.map((participant) => {
      const status =
        participant.id === senderId ? ReceiptStatus.READ : ReceiptStatus.SENT;
      const receipt = this.receiptRepository.create({
        message: savedMessage,
        user: participant,
        status,
        readAt: participant.id === senderId ? new Date() : null,
      });
      return receipt;
    });

    await this.receiptRepository.save(receipts);

    // Handle poll creation if included
    if (poll && messageData.type === MessageType.POLL) {
      const newPoll = this.pollRepository.create({
        question: poll.question,
        message: savedMessage,
        createdBy: sender,
        isMultipleChoice: poll.isMultipleChoice || false,
        isAnonymous: poll.isAnonymous || false,
        expiresAt: poll.expiresAt,
      });

      const savedPoll = await this.pollRepository.save(newPoll);

      // Create poll options
      const pollOptions = poll.options.map((option) =>
        this.pollOptionRepository.create({
          text: option.text,
          poll: savedPoll,
        }),
      );

      await this.pollOptionRepository.save(pollOptions);
    }

    // Handle game invite creation if included
    if (gameInvite && messageData.type === MessageType.GAME_INVITE) {
      const newGameInvite = this.gameInviteRepository.create({
        gameId: gameInvite.gameId,
        gameMode: gameInvite.gameMode,
        serverRegion: gameInvite.serverRegion,
        message: savedMessage,
        sender,
        expiresAt:
          gameInvite.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      });

      await this.gameInviteRepository.save(newGameInvite);
    }

    // Handle shared game item if included
    if (sharedGameItem && messageData.type === MessageType.GAME_ITEM) {
      const newSharedItem = this.sharedGameItemRepository.create({
        itemId: sharedGameItem.itemId,
        itemType: sharedGameItem.itemType,
        itemName: sharedGameItem.itemName,
        itemRarity: sharedGameItem.itemRarity,
        itemImageUrl: sharedGameItem.itemImageUrl,
        itemAttributes: sharedGameItem.itemAttributes,
        message: savedMessage,
        sharedBy: sender,
      });

      await this.sharedGameItemRepository.save(newSharedItem);
    }

    // Handle mentions
    if (
      messageData.mentionedUserIds &&
      messageData.mentionedUserIds.length > 0
    ) {
      // Validate that mentioned users are in the conversation
      const mentionedParticipants = conversation.participants.filter((p) =>
        messageData.mentionedUserIds.includes(p.id),
      );

      if (mentionedParticipants.length > 0) {
        // Send special notification to mentioned users
        mentionedParticipants.forEach((participant) => {
          if (participant.id !== senderId) {
            this.eventsGateway.sendEvent(participant.id, 'message:mentioned', {
              messageId: savedMessage.id,
              conversationId,
              senderId,
            });
          }
        });
      }
    }

    // Handle @everyone mention
    if (messageData.isMentioningEveryone) {
      // Check if user has permission to mention everyone
      const userRole = await this.roleRepository.findOne({
        where: { conversationId, userId: senderId },
      });

      if (
        !userRole ||
        (userRole.role !== ConversationRoleType.OWNER &&
          userRole.role !== ConversationRoleType.ADMIN)
      ) {
        throw new ForbiddenException(
          'You do not have permission to mention everyone',
        );
      }

      // Send special notification to all participants
      conversation.participants.forEach((participant) => {
        if (participant.id !== senderId) {
          this.eventsGateway.sendEvent(
            participant.id,
            'message:everyone_mentioned',
            {
              messageId: savedMessage.id,
              conversationId,
              senderId,
            },
          );
        }
      });
    }

    // Notify all participants about the new message
    conversation.participants.forEach((participant) => {
      if (participant.id !== senderId) {
        this.eventsGateway.sendEvent(
          participant.id,
          'message:created',
          savedMessage,
        );
      }
    });

    // Log analytics
    this.analyticsService.logMessageSent(
      savedMessage.id,
      senderId,
      conversationId,
      messageData.type,
    );

    return savedMessage;
  }

  async findAllMessages(
    conversationId: string,
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Message[]> {
    const { limit = 20, offset = 0 } = paginationQuery;

    await this.findOneConversation(conversationId, userId);

    const messages = await this.messageRepository.find({
      where: {
        conversationId,
        isDeleted: false,
        isScheduled: false, // Don't show scheduled messages that haven't been sent yet
        scheduledFor: LessThan(new Date()),
      },
      relations: [
        'sender',
        'replyTo',
        'receipts',
        'receipts.user',
        'reactions',
        'reactions.user',
        'polls',
        'polls.options',
        'gameInvites',
        'sharedGameItems',
      ],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    // Update message receipts to 'read' for this user
    const unreadMessages = messages.filter((message) => {
      const userReceipt = message.receipts.find((r) => r.userId === userId);
      return userReceipt && userReceipt.status !== ReceiptStatus.READ;
    });

    if (unreadMessages.length > 0) {
      const receiptIds = unreadMessages.flatMap((message) =>
        message.receipts.filter((r) => r.userId === userId).map((r) => r.id),
      );

      await this.receiptRepository.update(
        { id: In(receiptIds) },
        { status: ReceiptStatus.READ, readAt: new Date() },
      );

      // Notify senders that their messages have been read
      unreadMessages.forEach((message) => {
        this.eventsGateway.sendEvent(message.senderId, 'receipt:updated', {
          messageId: message.id,
          userId,
          status: ReceiptStatus.READ,
        });
      });
    }

    // Log analytics
    this.analyticsService.logMessagesViewed(
      conversationId,
      userId,
      messages.length,
    );

    return messages;
  }

  async findOneMessage(id: string, userId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: [
        'sender',
        'conversation',
        'conversation.participants',
        'replyTo',
        'receipts',
        'reactions',
        'reactions.user',
        'polls',
        'polls.options',
        'gameInvites',
        'sharedGameItems',
      ],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isParticipant = message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Update receipt if needed
    const userReceipt = message.receipts.find((r) => r.userId === userId);
    if (userReceipt && userReceipt.status !== ReceiptStatus.READ) {
      userReceipt.status = ReceiptStatus.READ;
      userReceipt.readAt = new Date();
      await this.receiptRepository.save(userReceipt);

      // Notify sender
      this.eventsGateway.sendEvent(message.senderId, 'receipt:updated', {
        messageId: message.id,
        userId,
        status: ReceiptStatus.READ,
      });
    }

    return message;
  }

  async updateMessage(
    id: string,
    updateMessageDto: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'conversation', 'conversation.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    if (message.isDeleted) {
      throw new BadRequestException('Cannot edit a deleted message');
    }

    // Check if message is too old to edit (e.g., 24 hours)
    const messageAge = Date.now() - message.createdAt.getTime();
    const maxEditAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (messageAge > maxEditAge) {
      throw new BadRequestException('Message is too old to edit');
    }

    // Content moderation
    if (message.conversation.isModerated) {
      const moderationResult = await this.moderatorService.moderateContent(
        updateMessageDto.content,
      );

      if (!moderationResult.isAllowed) {
        throw new BadRequestException(
          `Message rejected: ${moderationResult.reason}`,
        );
      }

      // If content is flagged but allowed, mark as moderated
      if (moderationResult.isFlagged) {
        message.isModerated = true;
        message.moderationReason = moderationResult.reason;
      }
    }

    // Only allow editing certain fields
    message.content = updateMessageDto.content;
    message.type = updateMessageDto.type || message.type;
    message.priority = updateMessageDto.priority || message.priority;
    message.mediaUrl = updateMessageDto.mediaUrl || message.mediaUrl;
    message.metadata = updateMessageDto.metadata || message.metadata;
    message.isEdited = true;
    message.editedAt = new Date();

    const updatedMessage = await this.messageRepository.save(message);

    // Notify all participants about the updated message
    message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(
          participant.id,
          'message:updated',
          updatedMessage,
        );
      }
    });

    // Log analytics
    this.analyticsService.logMessageEdited(id, userId);

    return updatedMessage;
  }

  async removeMessage(id: string, userId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'conversation', 'conversation.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user is the sender or has admin/owner privileges
    let hasPermission = message.senderId === userId;

    if (!hasPermission) {
      const userRole = await this.roleRepository.findOne({
        where: {
          conversationId: message.conversationId,
          userId,
          role: In([
            ConversationRoleType.ADMIN,
            ConversationRoleType.OWNER,
            ConversationRoleType.MODERATOR,
          ]),
        },
      });

      hasPermission = !!userRole;
    }

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to delete this message',
      );
    }

    // Soft delete
    message.isDeleted = true;
    message.content = 'This message has been deleted';
    await this.messageRepository.save(message);

    // Notify all participants
    message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'message:deleted', { id });
      }
    });

    // Log analytics
    this.analyticsService.logMessageDeleted(id, userId);
  }

  async updateReceipt(
    updateReceiptDto: UpdateMessageReceiptDto,
    userId: string,
  ): Promise<MessageReceipt> {
    const { messageId, status } = updateReceiptDto;

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation', 'conversation.participants', 'sender'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const isParticipant = message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    const receipt = await this.receiptRepository.findOne({
      where: { messageId, userId },
    });

    if (!receipt) {
      throw new NotFoundException('Receipt not found');
    }

    // Update receipt status
    receipt.status = status;

    if (status === ReceiptStatus.DELIVERED && !receipt.deliveredAt) {
      receipt.deliveredAt = new Date();
    }

    if (status === ReceiptStatus.READ && !receipt.readAt) {
      receipt.readAt = new Date();
    }

    const updatedReceipt = await this.receiptRepository.save(receipt);

    // Notify the sender
    this.eventsGateway.sendEvent(message.senderId, 'receipt:updated', {
      messageId,
      userId,
      status,
    });

    return updatedReceipt;
  }

  async getUnreadCount(
    userId: string,
  ): Promise<{ total: number; byConversation: Record<string, number> }> {
    const receipts = await this.receiptRepository
      .createQueryBuilder('receipt')
      .innerJoin('receipt.message', 'message')
      .innerJoin('message.conversation', 'conversation')
      .innerJoin('conversation.participants', 'participant')
      .where('receipt.userId = :userId', { userId })
      .andWhere('receipt.status != :status', { status: ReceiptStatus.READ })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('conversation.isActive = :isActive', { isActive: true })
      .select('message.conversationId', 'conversationId')
      .addSelect('COUNT(receipt.id)', 'count')
      .groupBy('message.conversationId')
      .getRawMany();

    const byConversation = receipts.reduce((acc, curr) => {
      acc[curr.conversationId] = Number.parseInt(curr.count, 10);
      return acc;
    }, {});

    const total = Object.values(byConversation).reduce(
      (sum: number, count: number) => sum + count,
      0,
    );

    return { total, byConversation };
  }

  // Message reactions
  async addMessageReaction(
    createReactionDto: CreateMessageReactionDto,
    userId: string,
  ): Promise<MessageReaction> {
    const { messageId, reaction } = createReactionDto;

    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation', 'conversation.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if conversation allows reactions
    if (!message.conversation.allowsReactions) {
      throw new ForbiddenException(
        'Reactions are not allowed in this conversation',
      );
    }

    const isParticipant = message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Check if reaction already exists
    const existingReaction = await this.reactionRepository.findOne({
      where: { messageId, userId, reaction },
    });

    if (existingReaction) {
      throw new ConflictException('You have already added this reaction');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newReaction = this.reactionRepository.create({
      message,
      user,
      reaction,
    });

    const savedReaction = await this.reactionRepository.save(newReaction);

    // Notify all participants
    message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'message:reaction_added', {
          messageId,
          userId,
          reaction,
        });
      }
    });

    // Log analytics
    this.analyticsService.logReactionAdded(messageId, userId, reaction);

    return savedReaction;
  }

  async removeMessageReaction(
    messageId: string,
    reaction: string,
    userId: string,
  ): Promise<void> {
    const existingReaction = await this.reactionRepository.findOne({
      where: { messageId, userId, reaction },
      relations: [
        'message',
        'message.conversation',
        'message.conversation.participants',
      ],
    });

    if (!existingReaction) {
      throw new NotFoundException('Reaction not found');
    }

    await this.reactionRepository.remove(existingReaction);

    // Notify all participants
    existingReaction.message.conversation.participants.forEach(
      (participant) => {
        if (participant.id !== userId) {
          this.eventsGateway.sendEvent(
            participant.id,
            'message:reaction_removed',
            {
              messageId,
              userId,
              reaction,
            },
          );
        }
      },
    );

    // Log analytics
    this.analyticsService.logReactionRemoved(messageId, userId, reaction);
  }

  // Pinned messages
  async pinMessage(messageId: string, userId: string): Promise<PinnedMessage> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['conversation', 'conversation.participants'],
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user has permission to pin messages
    const userRole = await this.roleRepository.findOne({
      where: {
        conversationId: message.conversationId,
        userId,
        role: In([ConversationRoleType.ADMIN, ConversationRoleType.OWNER]),
      },
    });

    if (!userRole) {
      throw new ForbiddenException(
        'You do not have permission to pin messages',
      );
    }

    // Check if message is already pinned
    const existingPin = await this.pinnedMessageRepository.findOne({
      where: { messageId, conversationId: message.conversationId },
    });

    if (existingPin) {
      throw new ConflictException('This message is already pinned');
    }

    // Check if max pins reached (e.g., limit to 3 pins per conversation)
    const pinCount = await this.pinnedMessageRepository.count({
      where: { conversationId: message.conversationId },
    });

    if (pinCount >= 3) {
      throw new BadRequestException(
        'Maximum number of pinned messages reached (3)',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newPin = this.pinnedMessageRepository.create({
      message,
      conversation: message.conversation,
      pinnedBy: user,
    });

    const savedPin = await this.pinnedMessageRepository.save(newPin);

    // Create system message
    await this.createSystemMessage(
      message.conversationId,
      `${user.username} pinned a message.`,
    );

    // Notify all participants
    message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'message:pinned', {
          messageId,
          conversationId: message.conversationId,
          pinnedById: userId,
        });
      }
    });

    // Log analytics
    this.analyticsService.logMessagePinned(
      messageId,
      userId,
      message.conversationId,
    );

    return savedPin;
  }

  async unpinMessage(messageId: string, userId: string): Promise<void> {
    const pinnedMessage = await this.pinnedMessageRepository.findOne({
      where: { messageId },
      relations: [
        'message',
        'message.conversation',
        'message.conversation.participants',
      ],
    });

    if (!pinnedMessage) {
      throw new NotFoundException('Pinned message not found');
    }

    // Check if user has permission to unpin messages
    const userRole = await this.roleRepository.findOne({
      where: {
        conversationId: pinnedMessage.conversationId,
        userId,
        role: In([ConversationRoleType.ADMIN, ConversationRoleType.OWNER]),
      },
    });

    if (!userRole) {
      throw new ForbiddenException(
        'You do not have permission to unpin messages',
      );
    }

    await this.pinnedMessageRepository.remove(pinnedMessage);

    // Create system message
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    await this.createSystemMessage(
      pinnedMessage.conversationId,
      `${user.username} unpinned a message.`,
    );

    // Notify all participants
    pinnedMessage.message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'message:unpinned', {
          messageId,
          conversationId: pinnedMessage.conversationId,
        });
      }
    });

    // Log analytics
    this.analyticsService.logMessageUnpinned(
      messageId,
      userId,
      pinnedMessage.conversationId,
    );
  }

  async getPinnedMessages(
    conversationId: string,
    userId: string,
  ): Promise<PinnedMessage[]> {
    await this.findOneConversation(conversationId, userId);

    const pinnedMessages = await this.pinnedMessageRepository.find({
      where: { conversationId },
      relations: ['message', 'message.sender', 'pinnedBy'],
      order: { pinnedAt: 'DESC' },
    });

    return pinnedMessages;
  }

  // Polls
  async votePoll(
    createVoteDto: CreatePollVoteDto,
    userId: string,
  ): Promise<PollVote> {
    const { pollId, optionId } = createVoteDto;

    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: [
        'message',
        'message.conversation',
        'message.conversation.participants',
        'options',
      ],
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Check if user is a participant in the conversation
    const isParticipant = poll.message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Check if poll is closed or expired
    if (poll.isClosed) {
      throw new BadRequestException('This poll is closed');
    }

    if (poll.expiresAt && poll.expiresAt < new Date()) {
      poll.isClosed = true;
      await this.pollRepository.save(poll);
      throw new BadRequestException('This poll has expired');
    }

    // Check if option exists in this poll
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      throw new NotFoundException('Poll option not found');
    }

    // Check if user has already voted
    const existingVote = await this.pollVoteRepository.findOne({
      where: { pollId, userId },
    });

    // If not multiple choice and user already voted, update their vote
    if (existingVote && !poll.isMultipleChoice) {
      // If voting for the same option, do nothing
      if (existingVote.optionId === optionId) {
        return existingVote;
      }

      // Otherwise, update their vote
      existingVote.option = option;
      existingVote.optionId = optionId;
      return this.pollVoteRepository.save(existingVote);
    }

    // If multiple choice, check if user already voted for this option
    if (poll.isMultipleChoice && existingVote) {
      const existingVotes = await this.pollVoteRepository.find({
        where: { pollId, userId },
      });

      // Check if user already voted for this option
      if (existingVotes.some((v) => v.optionId === optionId)) {
        throw new ConflictException('You have already voted for this option');
      }
    }

    // Create new vote
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newVote = this.pollVoteRepository.create({
      poll,
      option,
      user,
    });

    const savedVote = await this.pollVoteRepository.save(newVote);

    // Notify poll creator
    if (poll.createdById !== userId) {
      this.eventsGateway.sendEvent(poll.createdById, 'poll:vote', {
        pollId,
        optionId,
        userId,
      });
    }

    // Log analytics
    this.analyticsService.logPollVote(pollId, optionId, userId);

    return savedVote;
  }

  async getPollResults(pollId: string, userId: string): Promise<any> {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: [
        'message',
        'message.conversation',
        'message.conversation.participants',
        'options',
        'options.votes',
        'options.votes.user',
      ],
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Check if user is a participant in the conversation
    const isParticipant = poll.message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Calculate results
    const totalVotes = poll.options.reduce(
      (sum, option) => sum + option.votes.length,
      0,
    );

    const results = {
      id: poll.id,
      question: poll.question,
      isMultipleChoice: poll.isMultipleChoice,
      isAnonymous: poll.isAnonymous,
      isClosed: poll.isClosed,
      expiresAt: poll.expiresAt,
      createdAt: poll.createdAt,
      createdById: poll.createdById,
      totalVotes,
      options: poll.options.map((option) => {
        const voteCount = option.votes.length;
        const percentage =
          totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

        return {
          id: option.id,
          text: option.text,
          voteCount,
          percentage,
          voters: poll.isAnonymous
            ? []
            : option.votes.map((vote) => ({
                id: vote.userId,
                username: vote.user.username,
              })),
        };
      }),
      userVotes: poll.options
        .flatMap((option) => option.votes)
        .filter((vote) => vote.userId === userId)
        .map((vote) => vote.optionId),
    };

    return results;
  }

  async closePoll(pollId: string, userId: string): Promise<Poll> {
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: ['message', 'message.conversation'],
    });

    if (!poll) {
      throw new NotFoundException('Poll not found');
    }

    // Check if user is the creator or has admin/owner privileges
    let hasPermission = poll.createdById === userId;

    if (!hasPermission) {
      const userRole = await this.roleRepository.findOne({
        where: {
          conversationId: poll.message.conversationId,
          userId,
          role: In([ConversationRoleType.ADMIN, ConversationRoleType.OWNER]),
        },
      });

      hasPermission = !!userRole;
    }

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to close this poll',
      );
    }

    // Close the poll
    poll.isClosed = true;
    const updatedPoll = await this.pollRepository.save(poll);

    // Notify all participants
    poll.message.conversation.participants.forEach((participant) => {
      if (participant.id !== userId) {
        this.eventsGateway.sendEvent(participant.id, 'poll:closed', {
          pollId,
          messageId: poll.messageId,
        });
      }
    });

    // Log analytics
    this.analyticsService.logPollClosed(pollId, userId);

    return updatedPoll;
  }

  // Game invites
  async respondToGameInvite(
    inviteId: string,
    status: GameInviteStatus,
    userId: string,
  ): Promise<GameInvite> {
    const invite = await this.gameInviteRepository.findOne({
      where: { id: inviteId },
      relations: [
        'message',
        'message.conversation',
        'message.conversation.participants',
        'sender',
      ],
    });

    if (!invite) {
      throw new NotFoundException('Game invite not found');
    }

    // Check if user is a participant in the conversation
    const isParticipant = invite.message.conversation.participants.some(
      (p) => p.id === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant in this conversation',
      );
    }

    // Check if invite is still pending
    if (invite.status !== GameInviteStatus.PENDING) {
      throw new BadRequestException(
        `This invite has already been ${invite.status}`,
      );
    }

    // Check if invite has expired
    if (invite.expiresAt && invite.expiresAt < new Date()) {
      invite.status = GameInviteStatus.EXPIRED;
      await this.gameInviteRepository.save(invite);
      throw new BadRequestException('This invite has expired');
    }

    // Update invite status
    invite.status = status;
    invite.respondedAt = new Date();

    const updatedInvite = await this.gameInviteRepository.save(invite);

    // Create system message
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    await this.createSystemMessage(
      invite.message.conversationId,
      `${user.username} ${status === GameInviteStatus.ACCEPTED ? 'accepted' : 'declined'} ${invite.sender.username}'s game invite.`,
    );

    // Notify the sender
    this.eventsGateway.sendEvent(invite.senderId, 'game_invite:response', {
      inviteId,
      userId,
      status,
    });

    // Log analytics
    this.analyticsService.logGameInviteResponse(inviteId, userId, status);

    return updatedInvite;
  }

  // Search
  async searchMessages(
    query: string,
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Message[]> {
    const { limit = 20, offset = 0 } = paginationQuery;

    // Get all conversations the user is part of
    const userConversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin(
        'conversation.participants',
        'participant',
        'participant.id = :userId',
        { userId },
      )
      .where('conversation.isActive = :isActive', { isActive: true })
      .select('conversation.id')
      .getMany();

    const conversationIds = userConversations.map((c) => c.id);

    if (conversationIds.length === 0) {
      return [];
    }
  }
}
