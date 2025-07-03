import { PartialType } from '@nestjs/swagger';
import { CreateAnalyticsDto } from './create-analytics.dto';

export class UpdateAnalyticsDto extends PartialType(CreateAnalyticsDto) {}
