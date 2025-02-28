import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  ArrayMinSize,
  IsString,
  IsInt,
  Min,
  IsDate,
  IsArray,
} from "class-validator"
import { Type } from "class-transformer"
import { ConversationType } from "../entities/conversation.entity"

export class CreateConversationDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsEnum(ConversationType)
  type: ConversationType

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  topic?: string

  @IsBoolean()
  @IsOptional()
  isModerated?: boolean

  @IsInt()
  @Min(0)
  @IsOptional()
  maxParticipants?: number

  @IsBoolean()
  @IsOptional()
  isTemporary?: boolean

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date

  @IsBoolean()
  @IsOptional()
  allowsInvites?: boolean

  @IsBoolean()
  @IsOptional()
  allowsReactions?: boolean

  @IsBoolean()
  @IsOptional()
  allowsReplies?: boolean

  @IsBoolean()
  @IsOptional()
  allowsForwarding?: boolean

  @IsBoolean()
  @IsOptional()
  allowsMedia?: boolean

  @IsBoolean()
  @IsOptional()
  isReadOnly?: boolean

  @IsInt()
  @Min(0)
  @IsOptional()
  slowMode?: number

  @IsUUID("4", { each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  participantIds: string[]

  @IsOptional()
  @IsString()
  gameId?: string

  @IsOptional()
  @IsString()
  teamId?: string

  @IsOptional()
  @IsString()
  guildId?: string

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  adminIds?: string[]
}

