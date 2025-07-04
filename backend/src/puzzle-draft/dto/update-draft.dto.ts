import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftDto } from './create-draft.dto';

export class UpdateDraftDto extends PartialType(CreateDraftDto) {}
