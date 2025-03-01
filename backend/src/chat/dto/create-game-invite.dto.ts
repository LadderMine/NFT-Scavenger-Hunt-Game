import { IsString, IsNotEmpty, IsOptional, IsDate } from "class-validator"
import { Type } from "class-transformer"

export class CreateGameInviteDto {
  @IsString()
  @IsNotEmpty()
  gameId: string

  @IsString()
  @IsNotEmpty()
  gameMode: string

  @IsString()
  @IsOptional()
  serverRegion?: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date
}

