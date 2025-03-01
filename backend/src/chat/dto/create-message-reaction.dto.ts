import { IsString, IsNotEmpty, IsUUID } from "class-validator"

export class CreateMessageReactionDto {
  @IsUUID("4")
  @IsNotEmpty()
  messageId: string

  @IsString()
  @IsNotEmpty()
  reaction: string
}

