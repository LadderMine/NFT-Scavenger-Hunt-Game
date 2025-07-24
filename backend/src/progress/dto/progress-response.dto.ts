import { ApiProperty } from '@nestjs/swagger';

export class ProgressResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  completedPuzzles: number;

  @ApiProperty()
  totalPuzzles: number;

  @ApiProperty()
  percentComplete: number;

  @ApiProperty()
  lastUpdated: Date;
}
