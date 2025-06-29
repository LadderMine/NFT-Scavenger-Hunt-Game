import { PartialType } from '@nestjs/swagger';
import { CreateQuizDto } from './create-quiz.dto';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}
