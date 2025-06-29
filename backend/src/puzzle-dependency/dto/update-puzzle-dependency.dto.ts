import { PartialType } from '@nestjs/swagger';
import { CreatePuzzleDependencyDto } from './create-puzzle-dependency.dto';

export class UpdatePuzzleDependencyDto extends PartialType(CreatePuzzleDependencyDto) {}