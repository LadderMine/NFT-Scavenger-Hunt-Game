import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator"

export class PurchaseBoosterDto {
  @IsUUID()
  @IsNotEmpty()
  boosterId: string

  @IsNumber()
  @Min(1)
  quantity: number
}

