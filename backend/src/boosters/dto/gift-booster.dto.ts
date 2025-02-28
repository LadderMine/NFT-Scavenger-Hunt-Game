import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class GiftBoosterDto {
  @IsUUID()
  @IsNotEmpty()
  recipientId: string

  @IsUUID()
  @IsNotEmpty()
  boosterId: string

  @IsNumber()
  @Min(1)
  quantity: number

  @IsString()
  @IsOptional()
  message?: string
}

