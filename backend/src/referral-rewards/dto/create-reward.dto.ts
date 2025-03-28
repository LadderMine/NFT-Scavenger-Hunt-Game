import { IsUUID, IsNotEmpty, IsEnum, IsNumber, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { RewardType } from "../entities/reward.entity"

export class CreateRewardDto {
  @ApiProperty({
    description: "ID of the user receiving the reward",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: "Type of reward",
    enum: RewardType,
    example: RewardType.BONUS,
  })
  @IsEnum(RewardType)
  @IsNotEmpty()
  type: RewardType

  @ApiProperty({
    description: "Value of the reward",
    example: 100,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number
}

