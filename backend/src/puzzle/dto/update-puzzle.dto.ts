import { PartialType } from '@nestjs/swagger';
import { CreatePuzzleDto } from './create-puzzle.dto';

export class UpdatePuzzleDto extends PartialType(CreatePuzzleDto) {}
