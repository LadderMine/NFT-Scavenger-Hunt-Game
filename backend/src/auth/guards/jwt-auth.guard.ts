import { Injectable, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { Reflector } from "@nestjs/core"
import { AUTH_TYPE_KEY } from "../decorators/auth-decorator"
import { AuthType } from "../enums/auth-type.enum"

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    // Check if the route is marked as public
    const authType = this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (authType === AuthType.None) {
      return true // Allow access to public routes
    }

    return super.canActivate(context)
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const errorMessage = info?.message || "Unauthorized access"
      throw new UnauthorizedException(errorMessage)
    }
    return user
  }
}
