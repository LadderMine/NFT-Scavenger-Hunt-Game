import { IsEnum, IsInt, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LevelEnum } from "src/enums/LevelEnum";
import { CreateHintDto } from "src/hints/dto/create-hints.dto";


export class CreatePuzzleDto {
  @IsInt()
  pointValue: number;

  @IsEnum(LevelEnum)
  level: LevelEnum;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateHintDto)
  hints?: CreateHintDto[];
}
