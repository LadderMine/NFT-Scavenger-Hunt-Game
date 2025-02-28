import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class UseBoosterDto {
  @IsUUID()
  @IsNotEmpty()
  boosterId: string

  @IsString()
  @IsOptional()
  puzzleId?: string

  @IsOptional()
  metadata?: Record<string, any>
}

