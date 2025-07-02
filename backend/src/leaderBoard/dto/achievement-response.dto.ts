import { ApiProperty } from "@nestjs/swagger"
import { AchievementType } from "../entities/achievement.entity"

export class AchievementDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  description: string

  @ApiProperty()
  iconUrl: string

  @ApiProperty({ enum: AchievementType })
  type: AchievementType

  @ApiProperty({ required: false })
  requiredValue?: number
}

export class UserAchievementDto extends AchievementDto {
  @ApiProperty()
  earnedAt: Date

  @ApiProperty({ required: false })
  progressValue?: number
}

export class UserBadgesResponseDto {
  @ApiProperty({ type: [UserAchievementDto] })
  badges: UserAchievementDto[]

  @ApiProperty()
  totalBadges: number
}
