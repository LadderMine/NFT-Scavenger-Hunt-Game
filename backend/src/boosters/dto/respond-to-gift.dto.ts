import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator"

export class RespondToGiftDto {
  @IsUUID()
  @IsNotEmpty()
  giftId: string

  @IsBoolean()
  @IsNotEmpty()
  accept: boolean
}

