import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import e, { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfigtion: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    // extract the request from the execution context
    const request = context.switchToHttp().getRequest()
    // extract the token from the header
    const token = this.extractRequestFromHeader(request)
    // validate the header
    if (!token){
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token, this.jwtConfigtion
      )
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException(error)
      
    }
    return true;
  }
  
  private extractRequestFromHeader(request: Request){
    const [_, token] = request.headers.authorization?.split(' ') ?? []
    return token
  }
}
