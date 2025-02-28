import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  requirement: string

  @IsNumber()
  @Min(1)
  threshold: number

  @IsUUID()
  @IsNotEmpty()
  rewardBoosterId: string

  @IsNumber()
  @Min(1)
  rewardQuantity: number
}

