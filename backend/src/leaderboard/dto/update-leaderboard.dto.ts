import { PartialType } from '@nestjs/swagger';
import { CreateLeaderboardDto } from './create-leaderboard.dto';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {}
