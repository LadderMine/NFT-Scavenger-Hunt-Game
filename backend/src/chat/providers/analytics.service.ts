import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  logConversationCreated(
    conversationId: string,
    userId: string,
    type: string,
  ): void {
    console.log(
      `Conversation created: ${conversationId} by user ${userId}, type: ${type}`,
    );
  }

  logConversationDeleted(conversationId: string, userId: string): void {
    console.log(`Conversation deleted: ${conversationId} by user ${userId}`);
  }

  logUserJoinedConversation(conversationId: string, userId: string): void {
    console.log(`User ${userId} joined conversation ${conversationId}`);
  }

  logUserLeftConversation(conversationId: string, userId: string): void {
    console.log(`User ${userId} left conversation ${conversationId}`);
  }

  logMessageSent(
    messageId: string,
    userId: string,
    conversationId: string,
    messageType: string,
  ): void {
    console.log(
      `Message sent: ${messageId} by user ${userId} in conversation ${conversationId}, type: ${messageType}`,
    );
  }

  logMessageEdited(messageId: string, userId: string): void {
    console.log(`Message edited: ${messageId} by user ${userId}`);
  }

  logMessageDeleted(messageId: string, userId: string): void {
    console.log(`Message deleted: ${messageId} by user ${userId}`);
  }

  logMessagesViewed(
    conversationId: string,
    userId: string,
    count: number,
  ): void {
    console.log(
      `${count} messages viewed in conversation ${conversationId} by user ${userId}`,
    );
  }

  logReactionAdded(messageId: string, userId: string, reaction: string): void {
    console.log(
      `Reaction added: ${reaction} to message ${messageId} by user ${userId}`,
    );
  }

  logReactionRemoved(
    messageId: string,
    userId: string,
    reaction: string,
  ): void {
    console.log(
      `Reaction removed: ${reaction} from message ${messageId} by user ${userId}`,
    );
  }

  logMessagePinned(
    messageId: string,
    userId: string,
    conversationId: string,
  ): void {
    console.log(
      `Message pinned: ${messageId} in conversation ${conversationId} by user ${userId}`,
    );
  }

  logMessageUnpinned(
    messageId: string,
    userId: string,
    conversationId: string,
  ): void {
    console.log(
      `Message unpinned: ${messageId} in conversation ${conversationId} by user ${userId}`,
    );
  }

  logPollVote(pollId: string, optionId: string, userId: string): void {
    console.log(`Poll vote: ${pollId}, option ${optionId} by user ${userId}`);
  }

  logPollClosed(pollId: string, userId: string): void {
    console.log(`Poll closed: ${pollId} by user ${userId}`);
  }

  logGameInviteResponse(
    inviteId: string,
    userId: string,
    status: string,
  ): void {
    console.log(
      `Game invite ${inviteId} response: ${status} by user ${userId}`,
    );
  }
}
