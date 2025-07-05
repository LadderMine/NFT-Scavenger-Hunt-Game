import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressDto } from './create-progress.dto';

export class UpdateProgressDto extends PartialType(CreateProgressDto) {}
