import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  postId: number;

  @IsInt()
  userId: number;

  @IsNotEmpty()
  content: string;
}