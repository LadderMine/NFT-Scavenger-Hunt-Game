/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsDate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Hints } from "src/hints/hints.entity";
import { NFTs } from "src/nfts/nfts.entity";
import { UserProgress } from "src/user-progress/userprogress.entity";
import { Level } from "src/level/entities/level.entity";

export class PuzzleDto {
  @IsOptional()
  @IsInt()
  id?: number; // Auto-generated, so optional

  @IsOptional()
  @ValidateNested({ each: true }) 
  @Type(() => Hints)
  hints?: Hints[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;

  @IsInt({ message: "pointValue must be an integer" })
  pointValue: number; // Required field

  @IsOptional()
  @ValidateNested({ each: true }) 
  @Type(() => UserProgress)
  userProgress?: UserProgress[];

  @IsOptional()
  @ValidateNested()
  @Type(() => NFTs)
  nfts?: NFTs;

  @IsOptional()
  @ValidateNested()
  @Type(() => Level)
  level?: Level;
}

