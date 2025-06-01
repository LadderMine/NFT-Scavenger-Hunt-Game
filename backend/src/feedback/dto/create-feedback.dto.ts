import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  Length,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'ID of the user providing feedback',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID of the challenge being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  challengeId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;

  @ApiProperty({
    description: 'Detailed feedback comment',
    minLength: 10,
    maxLength: 1000,
    example:
      'This challenge was engaging and well-designed. The clues were challenging but fair.',
  })
  @IsNotEmpty()
  @Length(10, 1000, {
    message: 'Comment must be between 10 and 1000 characters',
  })
  comment: string;
}
