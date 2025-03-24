import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  IsBoolean,
  IsArray,
  IsDate,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"
import { MessageType, MessagePriority } from "../entities/message.entity"
import { CreatePollDto } from "./create-poll.dto"
import { CreateGameInviteDto } from "./create-game-invite.dto"
import { CreateSharedGameItemDto } from "./create-shared-game-item.dto"

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT

  @IsEnum(MessagePriority)
  @IsOptional()
  priority?: MessagePriority = MessagePriority.NORMAL

  @IsOptional()
  @IsString()
  mediaUrl?: string

  @IsOptional()
  @IsString()
  metadata?: string

  @IsUUID("4")
  @IsNotEmpty()
  conversationId: string

  @IsUUID("4")
  @IsOptional()
  replyToId?: string

  @IsBoolean()
  @IsOptional()
  isForwarded?: boolean

  @IsUUID("4")
  @IsOptional()
  forwardedFromId?: string

  @IsBoolean()
  @IsOptional()
  isMentioningEveryone?: boolean

  @IsArray()
  @IsUUID("4", { each: true })
  @IsOptional()
  mentionedUserIds?: string[]

  @IsBoolean()
  @IsOptional()
  isScheduled?: boolean

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledFor?: Date

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateGameInviteDto)
  gameInvite?: CreateGameInviteDto

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSharedGameItemDto)
  sharedGameItem?: CreateSharedGameItemDto
}

