import { AuthType } from '../../enums/auth-type.enum';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AUTH_TYPE_KEY } from 'src/auth/constant/auth-constant';

@Injectable()
export class AuthTokenGuard implements CanActivate {
//default auth type is Bearer
private static readonly defaultAuthType = AuthType.Bearer;
//map of auth type to guard
private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
  [AuthType.Bearer]: this.accessTokenGuard,
  [AuthType.None]: {canActivate: ()=> true}
} 

constructor(
  //reflector to get metadata
  private readonly reflector: Reflector,
  //AccessTokenGuard Defendency
  private readonly accessTokenGuard: AccessTokenGuard
){}


  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get auth types from metadata, if none use default
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthTokenGuard.defaultAuthType];  // Make sure it's an array

    // Convert single auth type to array if necessary
    const authTypesArray = Array.isArray(authTypes) ? authTypes : [authTypes];

    const guards = authTypesArray.map((type) => this.authTypeGuardMap[type]).flat();
    
    const error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch(() => {
        throw error;
      });

      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
