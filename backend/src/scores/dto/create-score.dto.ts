import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScoreDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The score of the user' })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  score: number;

  @ApiProperty({ description: 'Id for the connected puzzle' })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  puzzleId: number;
}
