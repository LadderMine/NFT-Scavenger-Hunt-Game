/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUserDto } from '../dtos/create-user-dto.dto';

@Injectable()
export class CreateUserProvider {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  @Inject(forwardRef(() => HashingProvider))
  private readonly hashingProvider: HashingProvider;

  public async createUsers(createUserDto: CreateUserDto) {
    let existingUser = undefined;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process this request, please try later',
        {
          description: 'Error connecting to your database',
          cause: 'The user is using Glo network',
        },
      );
    }

    if (existingUser) {
    }

    let newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('user already exists');
    }
    return [newUser];
  }
}
