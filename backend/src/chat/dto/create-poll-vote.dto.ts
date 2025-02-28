import { IsUUID, IsNotEmpty } from "class-validator"

export class CreatePollVoteDto {
  @IsUUID("4")
  @IsNotEmpty()
  pollId: string

  @IsUUID("4")
  @IsNotEmpty()
  optionId: string
}

