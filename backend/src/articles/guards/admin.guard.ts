import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from "@nestjs/common"
import type { Observable } from "rxjs"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    // This is a placeholder. In a real application, you would check if the user is an admin
    // based on your authentication system. For example:
    // if (request.user && request.user.roles.includes('admin')) {
    //   return true;
    // }

    // For now, we'll assume there's a user object with an isAdmin property
    if (request.user && request.user.isAdmin) {
      return true
    }

    throw new UnauthorizedException("Admin access required")
  }
}

