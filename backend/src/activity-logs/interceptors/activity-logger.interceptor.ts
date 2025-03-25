import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import type { ActivityLogsService } from "../activity-logs.service"

@Injectable()
export class ActivityLoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
    private readonly options: {
      action: string
      getMetadata?: (request: any, response: any) => Record<string, any>
      getUserId?: (request: any) => string | null
    },
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const startTime = Date.now()

    return next.handle().pipe(
      tap(async (response) => {
        const userId = this.options.getUserId ? this.options.getUserId(request) : null
        const metadata = this.options.getMetadata
          ? this.options.getMetadata(request, response)
          : {
              path: request.path,
              method: request.method,
              duration: Date.now() - startTime,
            }

        await this.activityLogsService.create({
          userId,
          action: this.options.action,
          metadata,
          ipAddress: request.ip,
          userAgent: request.headers["user-agent"],
        })
      }),
    )
  }
}

