import { IsEnum, IsNotEmpty, IsUUID } from "class-validator"
import { ConversationRoleType } from "../entities/conversation-role.entity"

export class UpdateConversationRoleDto {
  @IsUUID("4")
  @IsNotEmpty()
  userId: string

  @IsEnum(ConversationRoleType)
  @IsNotEmpty()
  role: ConversationRoleType
}

