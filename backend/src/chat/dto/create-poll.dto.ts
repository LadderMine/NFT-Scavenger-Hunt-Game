import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from "class-validator"
import { Type } from "class-transformer"

class PollOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string
}

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  question: string

  @IsBoolean()
  @IsOptional()
  isMultipleChoice?: boolean

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date

  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => PollOptionDto)
  options: PollOptionDto[]
}

