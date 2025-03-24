import { Injectable, type NestMiddleware, Logger } from "@nestjs/common"
import type { Request, Response, NextFunction } from "express"
import type { ActivityLogsService } from "../activity-logs.service"
import { ActivityAction, ActivityCategory, ActivitySeverity } from "../interfaces/activity-constants"

@Injectable()
export class ActivityLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ActivityLoggerMiddleware.name)

  constructor(private readonly activityLogsService: ActivityLogsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now()

    // Store original end function
    const originalEnd = res.end

    // Override end function
    res.end = (...args: any[]) => {
      // Restore original end function
      res.end = originalEnd

      // Call original end function
      res.end(...args)

      // Log the activity after response is sent
      this.logActivity(req, res, startTime).catch((error) => {
        this.logger.error(`Failed to log activity: ${error.message}`)
      })
    }

    next()
  }

  private async logActivity(req: Request, res: Response, startTime: number) {
    try {
      const duration = Date.now() - startTime
      const statusCode = res.statusCode

      // Determine severity based on status code
      let severity = ActivitySeverity.INFO
      if (statusCode >= 500) {
        severity = ActivitySeverity.ERROR
      } else if (statusCode >= 400) {
        severity = ActivitySeverity.WARNING
      }

      // Determine category based on path
      let category = ActivityCategory.API_USAGE
      if (req.path.includes("/auth")) {
        category = ActivityCategory.AUTHENTICATION
      } else if (req.path.includes("/admin")) {
        category = ActivityCategory.CONFIGURATION
      }

      // Extract user ID from request if available
      const userId = (req as any).user?.id

      await this.activityLogsService.create({
        userId,
        action: ActivityAction.API_REQUEST,
        category,
        severity,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] as string,
        sessionId: (req as any).sessionID,
        requestId: req.headers["x-request-id"] as string,
        requestPath: req.path,
        requestMethod: req.method,
        statusCode,
        duration,
        metadata: {
          query: req.query,
          headers: this.sanitizeHeaders(req.headers),
          response: {
            statusCode,
            duration,
          },
        },
      })
    } catch (error) {
      this.logger.error(`Error in activity logger middleware: ${error.message}`)
    }
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    // Remove sensitive headers
    const sanitized = { ...headers }
    const sensitiveHeaders = ["authorization", "cookie", "set-cookie", "x-api-key"]

    sensitiveHeaders.forEach((header) => {
      if (sanitized[header]) {
        sanitized[header] = "[REDACTED]"
      }
    })

    return sanitized
  }
}

