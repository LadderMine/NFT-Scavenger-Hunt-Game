import { IsNotEmpty, IsUUID } from "class-validator"

export class ClaimAchievementDto {
  @IsUUID()
  @IsNotEmpty()
  achievementId: string
}

