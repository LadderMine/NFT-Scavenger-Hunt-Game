import { IsNotEmpty, IsString } from "class-validator"

export class RegisterAffiliateDto {
  @IsNotEmpty()
  @IsString()
  userId: string
}

