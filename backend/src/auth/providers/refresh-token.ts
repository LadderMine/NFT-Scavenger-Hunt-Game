import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './generate-token.provider';
import jwtConfig from '../config/jwt.config';
import { UsersService } from 'src/users/users.service';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,
    // jwt service
    private readonly jwtService: JwtService,

    // jwt config injcetion
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    // inter dependency injection of genrate token provider
    private readonly generateTokensProvider: GenerateTokenProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Validate the refresh token using jwtService
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      // Grab the user from the database based on the user ID (sub)
      const user = await this.userServices.findOneById(sub);

      // Generate a new access token
      const access_token = await this.generateTokensProvider.LogInToken(
        user.id,
        this.jwtConfiguration.ttl, // Access token expiration time
        { email: user.email },
      );

      // Return the new access token with the **same refresh token**
      return { access_token, refresh_token: refreshTokenDto.refreshToken };
    } catch (error) {
      // If the refresh token is expired, generate a new refresh token
      if (error.name === 'TokenExpiredError') {
        const user = await this.userServices.findOneById(
          this.jwtService.decode(refreshTokenDto.refreshToken)['sub'],
        );

        // Generate both a new access and refresh token
        const tokens = await this.generateTokensProvider.generateToken(user);

        return tokens; // Return both new access & refresh tokens
      }

      // Catch other JWT errors
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
