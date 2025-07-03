import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import type { Request } from "express"

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()

    // Extract admin status from request
    // This is a simplified implementation - adjust based on your auth system
    const isAdmin = this.extractAdminStatusFromRequest(request)

    if (!isAdmin) {
      throw new ForbiddenException("Admin access required")
    }

    return true
  }

  private extractAdminStatusFromRequest(request: Request): boolean {
    // In a real implementation, you'd decode JWT token and check roles
    // For now, we'll check for a custom header (for testing purposes)
    const adminHeader = request.headers["x-admin"] as string
    const userRole = request.headers["x-user-role"] as string

    return adminHeader === "true" || userRole === "admin"
  }
}
