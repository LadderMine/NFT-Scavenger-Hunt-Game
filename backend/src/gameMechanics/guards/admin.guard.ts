import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import { UserRole } from "../entities/user.entity"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Admin access required")
    }

    return true
  }
}
