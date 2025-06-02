import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AUTH_TYPE_KEY } from '../../constant/auth-constant';
import { AuthType } from '../../enums/auth-type.enum';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  // Default auth type is Bearer.
  private static readonly defaultAuthType = AuthType.Bearer;

  // Map auth type to the corresponding guard.
  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> =
    {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the auth type metadata (if not set, default to Bearer).
    const authTypes =
      this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
        context.getHandler(),
        context.getClass(),
        
      ]) ?? [AuthTokenGuard.defaultAuthType];

    // Ensure we work with an array.
    const authTypesArray = Array.isArray(authTypes) ? authTypes : [authTypes];

    // Gather all guards based on the auth types.
    const guards = authTypesArray
      .map((type) => this.authTypeGuardMap[type])
      .flat();

    const error = new UnauthorizedException();

    // Run through each guard; if any passes, allow access.
    for (const guard of guards) {
      const canActivate = await Promise.resolve(guard.canActivate(context)).catch(
        () => {
          throw error;
        },
      );

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
