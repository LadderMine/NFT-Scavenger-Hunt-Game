import { IsEnum, IsNotEmpty, IsUUID } from "class-validator"
import { GameInviteStatus } from "../entities/game-invite.entity"

export class RespondToGameInviteDto {
  @IsUUID("4")
  @IsNotEmpty()
  inviteId: string

  @IsEnum(GameInviteStatus, {
    message: "Status must be either accepted or declined",
  })
  @IsNotEmpty()
  status: GameInviteStatus.ACCEPTED | GameInviteStatus.DECLINED
}

