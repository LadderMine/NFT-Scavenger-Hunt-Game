import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ClaimRewardDto {
  @ApiProperty({
    description: 'User ID requesting the reward claim',
    example: 'user-123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Challenge ID for which the reward is being claimed',
    example: 'challenge-easy-001',
  })
  @IsString()
  @IsNotEmpty()
  challengeId: string;
}
