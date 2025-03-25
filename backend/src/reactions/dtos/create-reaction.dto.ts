import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateReactionDto {
  @IsInt()
  postId: number;

  @IsInt()
  userId: number;

  @IsNotEmpty()
  reactionType: string;
}