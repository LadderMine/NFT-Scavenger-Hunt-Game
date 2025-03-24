import { PartialType } from '@nestjs/mapped-types';
import { CreateApiTrackingDto } from './create-api-tracking.dto';

export class UpdateApiTrackingDto extends PartialType(CreateApiTrackingDto) {}
