import { IsUUID, IsOptional, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { RewardType, RewardStatus } from "../entities/reward.entity"

export class QueryRewardsDto {
  @ApiProperty({
    description: "ID of the user to filter rewards by",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string

  @ApiProperty({
    description: "Type of reward to filter by",
    enum: RewardType,
    example: RewardType.BONUS,
    required: false,
  })
  @IsEnum(RewardType)
  @IsOptional()
  type?: RewardType

  @ApiProperty({
    description: "Status of reward to filter by",
    enum: RewardStatus,
    example: RewardStatus.GRANTED,
    required: false,
  })
  @IsEnum(RewardStatus)
  @IsOptional()
  status?: RewardStatus
}

