import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users.entity';
import { Repository } from 'typeorm';
import { RequestTimeoutException, UnauthorizedException } from '@nestjs/common';

export class FindByUsername {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async FindOneByUsername(username: string) {
    let user: User | undefined;
    try {
      user = await this.userRepository.findOneBy({ username });
    } catch (error) {
      throw new RequestTimeoutException('Unable to complete request');
    }

    if (!user) {
      throw new UnauthorizedException('Username/User Not Found');
    }

    return user;
  }
}
