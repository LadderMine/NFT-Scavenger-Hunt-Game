import { PartialType } from '@nestjs/mapped-types';
import { CreateUserReportCardDto } from './create-user-report-card.dto';

export class UpdateUserReportCardDto extends PartialType(CreateUserReportCardDto) {}
