import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { DifficultyLevel } from "../hints.entity";

export class CreateHintDto {
@IsNotEmpty()
puzzleId: number;

@IsNotEmpty()
hintText: string;

@IsOptional()
@IsEnum(DifficultyLevel)
difficultyLevel?: DifficultyLevel;
  }