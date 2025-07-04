import { PartialType } from '@nestjs/swagger';
import { CreateUserRankingDto } from './create-user-ranking.dto';

export class UpdateUserRankingDto extends PartialType(CreateUserRankingDto) {}
