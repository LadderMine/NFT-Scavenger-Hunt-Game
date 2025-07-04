import { IsString, IsUUID, IsOptional, IsInt } from "class-validator"

export class SubmitPuzzleDto {
  @IsUUID()
  challengeId: string

  @IsString()
  answer: string

  @IsInt()
  @IsOptional()
  timeTaken?: number
}
