import { PartialType } from '@nestjs/swagger';
import { CreatePuzzleCommentDto } from './create-puzzle-comment.dto';

export class UpdatePuzzleCommentDto extends PartialType(CreatePuzzleCommentDto) {}
