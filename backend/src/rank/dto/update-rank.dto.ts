import { PartialType } from '@nestjs/swagger';
import { CreateRankDto } from './create-rank.dto';

export class UpdateRankDto extends PartialType(CreateRankDto) {}
