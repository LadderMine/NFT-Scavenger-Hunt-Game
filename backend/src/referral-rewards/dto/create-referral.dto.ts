import { IsUUID, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateReferralDto {
  @ApiProperty({
    description: "ID of the user who is making the referral",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsUUID()
  @IsNotEmpty()
  referrerId: string

  @ApiProperty({
    description: "ID of the user who is being referred",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsUUID()
  @IsNotEmpty()
  referredId: string
}

