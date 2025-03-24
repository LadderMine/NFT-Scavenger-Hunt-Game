import { IsArray, IsDateString, IsOptional, IsUUID } from "class-validator"

export class AnonymizeLogsDto {
  @IsOptional()
  @IsUUID()
  userId?: string

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  userIds?: string[]

  @IsOptional()
  @IsDateString()
  olderThan?: string
}

