import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { UserBadge } from './entities/user-badge.entity';
import { AssignBadgeDto } from './dto/assign-badge.dto';

@Injectable()
export class BadgeService {
  constructor(
    @InjectRepository(Badge) private badgeRepo: Repository<Badge>,
    @InjectRepository(UserBadge) private userBadgeRepo: Repository<UserBadge>,
  ) {}

  async assignBadgeToUser(dto: AssignBadgeDto): Promise<UserBadge> {
    const badge = await this.badgeRepo.findOneBy({ id: dto.badgeId });
    if (!badge) throw new NotFoundException('Badge not found');

    const userBadge = this.userBadgeRepo.create({
      userId: dto.userId,
      badge,
    });
    return this.userBadgeRepo.save(userBadge);
  }

  async getBadgesForUser(userId: number): Promise<Badge[]> {
    const userBadges = await this.userBadgeRepo.find({ where: { userId } });
    return userBadges.map((ub) => ub.badge);
  }
}
