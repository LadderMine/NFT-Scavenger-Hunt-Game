import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsBoolean } from "class-validator"
import { BoosterType, BoosterRarity } from "../entities/booster.entity"

export class CreateBoosterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsEnum(BoosterType)
  type: BoosterType

  @IsNumber()
  @Min(1)
  value: number

  @IsNumber()
  @Min(1)
  @IsOptional()
  duration = 1

  @IsNumber()
  @Min(0)
  @IsOptional()
  price = 0

  @IsEnum(BoosterRarity)
  @IsOptional()
  rarity: BoosterRarity = BoosterRarity.COMMON

  @IsNumber()
  @Min(0)
  @IsOptional()
  cooldownSeconds = 0

  @IsBoolean()
  @IsOptional()
  isLimited = false

  @IsNumber()
  @IsOptional()
  dailyUsageLimit?: number

  @IsNumber()
  @IsOptional()
  weeklyUsageLimit?: number

  @IsBoolean()
  @IsOptional()
  isActive = true

  @IsBoolean()
  @IsOptional()
  isGiftable = false
}

