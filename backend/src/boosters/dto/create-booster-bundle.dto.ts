import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator"

export class CreateBoosterBundleDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @Min(0)
  price: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountedPrice?: number

  @IsUUID()
  @IsNotEmpty()
  boosterId: string

  @IsNumber()
  @Min(1)
  quantity: number

  @IsOptional()
  startsAt?: Date

  @IsOptional()
  endsAt?: Date

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchaseLimit = 0
}

