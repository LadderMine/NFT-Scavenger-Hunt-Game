import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common"

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name)

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    // Check for admin role in user object (assuming it's set by auth middleware)
    const user = request.user
    if (!user) {
      this.logger.warn("No user found in request")
      throw new UnauthorizedException("Authentication required")
    }

    // Check if user has admin role
    if (!user.roles?.includes("admin") && user.role !== "admin") {
      this.logger.warn(`User ${user.id} attempted to access admin endpoint without proper permissions`)
      throw new UnauthorizedException("Admin access required")
    }

    this.logger.log(`Admin access granted to user ${user.id}`)
    return true
  }
}
