import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

export class GenerateTokenProvider {
  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async LogInToken(id: number, username: string) {
    return await this.jwtService.signAsync(
      {
        sub: id,
        name: username,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.ttl,
      },
    );

    // return jwtToken;
  }
}
