import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthCheckDto } from './create-health-check.dto';

export class UpdateHealthCheckDto extends PartialType(CreateHealthCheckDto) {}
