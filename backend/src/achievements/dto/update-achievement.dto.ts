import { PartialType } from '@nestjs/swagger';
import { CreateAchievementDto } from './create-achievement.dto';

export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}
