import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/users.entity';

export class GenerateTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async LogInToken<T>(id: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: id,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn,
      },
    );

    // return jwtToken;
  }

  public async generateToken(user: User) {
    const [access_token, refresh_token] = await Promise.all([
      // generate access token
      this.LogInToken(user.id, this.jwtConfiguration.ttl, {
        email: user.email,
      }),
      // generate refresh token
      this.LogInToken(user.id, this.jwtConfiguration.Rttl),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}
