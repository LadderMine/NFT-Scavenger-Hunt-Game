import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { LinkWalletDto } from './dto/link-wallet.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    if (await this.usersRepo.findOne({ where: { email: dto.email } })) {
      throw new ConflictException('Email already registered');
    }
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  async updateProfile(id: string, dto: UpdateUserProfileDto): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, dto);
    return this.usersRepo.save(user);
  }

  async linkWallet(id: string, dto: LinkWalletDto): Promise<User> {
    const user = await this.getUserById(id);
    user.walletAddress = dto.walletAddress;
    return this.usersRepo.save(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { walletAddress } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
