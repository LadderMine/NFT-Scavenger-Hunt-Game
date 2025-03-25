import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common"
import type { ChatService } from "./chat.service"
import type { CreateConversationDto } from "./dto/create-conversation.dto"
import type { CreateMessageDto } from "./dto/create-message.dto"
import type { UpdateMessageReceiptDto } from "./dto/update-message-receipt.dto"
import type { UpdateConversationRoleDto } from "./dto/update-conversation-role.dto"
import type { CreateMessageReactionDto } from "./dto/create-message-reaction.dto"
import type { CreatePollVoteDto } from "./dto/create-poll-vote.dto"
import type { RespondToGameInviteDto } from "./dto/respond-to-game-invite.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { PaginationQueryDto } from "../common/dto/pagination-query.dto"

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Conversation endpoints
  @Post("conversations")
  createConversation(@Body() createConversationDto: CreateConversationDto, @Req() req) {
    return this.chatService.createConversation(createConversationDto, req.user.id)
  }

  @Get("conversations")
  findAllConversations(@Req() req, @Query() paginationQuery: PaginationQueryDto) {
    return this.chatService.findAllConversations(req.user.id, paginationQuery)
  }

  @Get("conversations/:id")
  findOneConversation(@Param('id') id: string, @Req() req) {
    return this.chatService.findOneConversation(id, req.user.id)
  }

  @Patch("conversations/:id")
  updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: Partial<CreateConversationDto>,
    @Req() req,
  ) {
    return this.chatService.updateConversation(id, updateConversationDto, req.user.id)
  }

  @Delete("conversations/:id")
  removeConversation(@Param('id') id: string, @Req() req) {
    return this.chatService.removeConversation(id, req.user.id)
  }

  @Post("conversations/:id/join")
  @HttpCode(HttpStatus.OK)
  joinConversation(@Param('id') id: string, @Req() req) {
    return this.chatService.joinConversation(id, req.user.id)
  }

  @Post("conversations/:id/leave")
  @HttpCode(HttpStatus.OK)
  leaveConversation(@Param('id') id: string, @Req() req) {
    return this.chatService.leaveConversation(id, req.user.id)
  }

  @Post("conversations/:id/roles")
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateConversationRoleDto, @Req() req) {
    return this.chatService.updateConversationRole(id, updateRoleDto, req.user.id)
  }

  // Message endpoints
  @Post("messages")
  createMessage(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    return this.chatService.createMessage(createMessageDto, req.user.id)
  }

  @Get("conversations/:conversationId/messages")
  findAllMessages(
    @Param('conversationId') conversationId: string,
    @Req() req,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.chatService.findAllMessages(conversationId, req.user.id, paginationQuery)
  }

  @Get("messages/:id")
  findOneMessage(@Param('id') id: string, @Req() req) {
    return this.chatService.findOneMessage(id, req.user.id)
  }

  @Patch("messages/:id")
  updateMessage(@Param('id') id: string, @Body() updateMessageDto: CreateMessageDto, @Req() req) {
    return this.chatService.updateMessage(id, updateMessageDto, req.user.id)
  }

  @Delete("messages/:id")
  removeMessage(@Param('id') id: string, @Req() req) {
    return this.chatService.removeMessage(id, req.user.id)
  }

  @Patch("receipts")
  updateReceipt(@Body() updateReceiptDto: UpdateMessageReceiptDto, @Req() req) {
    return this.chatService.updateReceipt(updateReceiptDto, req.user.id)
  }

  @Get('unread-count')
  getUnreadCount(@Req() req) {
    return this.chatService.getUnreadCount(req.user.id);
  }

  // Message reactions
  @Post("messages/reactions")
  addReaction(@Body() createReactionDto: CreateMessageReactionDto, @Req() req) {
    return this.chatService.addMessageReaction(createReactionDto, req.user.id)
  }

  @Delete("messages/:messageId/reactions/:reaction")
  removeReaction(@Param('messageId') messageId: string, @Param('reaction') reaction: string, @Req() req) {
    return this.chatService.removeMessageReaction(messageId, reaction, req.user.id)
  }

  // Pinned messages
  @Post("messages/:id/pin")
  pinMessage(@Param('id') id: string, @Req() req) {
    return this.chatService.pinMessage(id, req.user.id)
  }

  @Delete("messages/:id/pin")
  unpinMessage(@Param('id') id: string, @Req() req) {
    return this.chatService.unpinMessage(id, req.user.id)
  }

  @Get("conversations/:conversationId/pins")
  getPinnedMessages(@Param('conversationId') conversationId: string, @Req() req) {
    return this.chatService.getPinnedMessages(conversationId, req.user.id)
  }

  // Polls
  @Post("polls/vote")
  votePoll(@Body() createVoteDto: CreatePollVoteDto, @Req() req) {
    return this.chatService.votePoll(createVoteDto, req.user.id)
  }

  @Get("polls/:id/results")
  getPollResults(@Param('id') id: string, @Req() req) {
    return this.chatService.getPollResults(id, req.user.id)
  }

  @Patch("polls/:id/close")
  closePoll(@Param('id') id: string, @Req() req) {
    return this.chatService.closePoll(id, req.user.id)
  }

  // Game invites
  @Patch("game-invites/:id/respond")
  respondToGameInvite(@Param('id') id: string, @Body() responseDto: RespondToGameInviteDto, @Req() req) {
    return this.chatService.respondToGameInvite(id, responseDto.status, req.user.id)
  }

  // Search
  @Get("search")
  searchMessages(@Query('query') query: string, @Query() paginationQuery: PaginationQueryDto, @Req() req) {
    return this.chatService.searchMessages(query, req.user.id, paginationQuery)
  }

  // Analytics
  @Get("analytics/conversations/:id")
  getConversationAnalytics(@Param('id') id: string, @Req() req) {
    return this.chatService.getConversationAnalytics(id, req.user.id)
  }

  @Get('analytics/user')
  getUserChatAnalytics(@Req() req) {
    return this.chatService.getUserChatAnalytics(req.user.id);
  }
}

