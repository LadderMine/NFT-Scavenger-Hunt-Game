import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { LogInDto } from '../dto/log-in.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';

@Injectable()
export class LogInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hashingProvider: HashingProvider,

    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}
  public async LogInToken(logInDto: LogInDto) {
    //find user by username
    let user = await this.userService.FindByUsername(logInDto.username);

    //compare passwords, inputed with one in db
    let isSame: boolean = false;

    try {
      isSame = await this.hashingProvider.comparePassword(
        logInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Unable to complete request',
      });
    }

    if (!isSame) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    //GenerateToken/Get generated token from the provider if user has been successfully found
    const accessToken = await this.generateTokenProvider.LogInToken(
      user.id,
      user.username,
    );
    // console.table([user, accessToken]);

    return { user, accessToken };
    return accessToken;
    return user;
  }
}
