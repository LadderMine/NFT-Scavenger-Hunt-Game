import { Injectable, type CanActivate, type ExecutionContext, ServiceUnavailableException } from "@nestjs/common"
import type { Reflector } from "@nestjs/core"
import type { Request } from "express"
import type { MaintenanceModeService } from "../maintenance-mode.service"
import { ADMIN_ONLY_KEY } from "../decorators/admin-only.decorator"
import { MAINTENANCE_EXEMPT_KEY } from "../decorators/maintenance-exempt.decorator"

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private readonly maintenanceModeService: MaintenanceModeService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is exempt from maintenance mode
    const isMaintenanceExempt = this.reflector.getAllAndOverride<boolean>(MAINTENANCE_EXEMPT_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isMaintenanceExempt) {
      return true
    }

    // Check if route is admin-only (admin routes are always allowed)
    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(ADMIN_ONLY_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isAdminOnly) {
      return true
    }

    // Get maintenance status
    const maintenanceStatus = await this.maintenanceModeService.getMaintenanceStatus()

    if (!maintenanceStatus.isMaintenanceMode) {
      return true
    }

    // If maintenance mode is active, check various exemptions
    const request = context.switchToHttp().getRequest<Request>()
    const path = request.path
    const userId = this.extractUserIdFromRequest(request)

    // Check if route is in allowed routes
    if (await this.isRouteAllowed(path)) {
      return true
    }

    // Check if user is in allowed users list
    if (userId && (await this.isUserAllowed(userId))) {
      return true
    }

    // Check route type blocking settings
    const config = await this.maintenanceModeService.getMaintenanceConfig()
    const isApiRoute = path.startsWith("/api") || this.isApiRequest(request)
    const isWebRoute = !isApiRoute

    if (isApiRoute && !config.blockApiRoutes) {
      return true
    }

    if (isWebRoute && !config.blockWebRoutes) {
      return true
    }

    // Block access and throw maintenance exception
    throw new ServiceUnavailableException({
      message: maintenanceStatus.maintenanceMessage || "System is currently under maintenance",
      maintenanceMode: true,
      scheduledEnd: maintenanceStatus.scheduledEnd,
      reason: maintenanceStatus.reason,
    })
  }

  private extractUserIdFromRequest(request: Request): string | null {
    // Extract user ID from JWT token, session, or headers
    // This is a simplified implementation - adjust based on your auth system
    const authHeader = request.headers.authorization
    if (authHeader?.startsWith("Bearer ")) {
      try {
        // In a real implementation, you'd decode the JWT token here
        // For now, we'll check for a custom header
        return (request.headers["x-user-id"] as string) || null
      } catch {
        return null
      }
    }

    // Check for user ID in custom header (for testing)
    return (request.headers["x-user-id"] as string) || null
  }

  private async isRouteAllowed(path: string): Promise<boolean> {
    const config = await this.maintenanceModeService.getMaintenanceConfig()
    if (!config.allowedRoutes || config.allowedRoutes.length === 0) {
      return false
    }

    return config.allowedRoutes.some((allowedRoute) => {
      // Support wildcard matching
      if (allowedRoute.endsWith("*")) {
        const prefix = allowedRoute.slice(0, -1)
        return path.startsWith(prefix)
      }
      return path === allowedRoute
    })
  }

  private async isUserAllowed(userId: string): Promise<boolean> {
    const config = await this.maintenanceModeService.getMaintenanceConfig()
    return config.allowedUserIds?.includes(userId) || false
  }

  private isApiRequest(request: Request): boolean {
    // Check if request is an API request based on headers or path
    const acceptHeader = request.headers.accept
    const contentType = request.headers["content-type"]

    return (
      acceptHeader?.includes("application/json") ||
      contentType?.includes("application/json") ||
      request.path.startsWith("/api")
    )
  }
}
