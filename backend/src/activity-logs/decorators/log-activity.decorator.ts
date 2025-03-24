import { applyDecorators, UseInterceptors } from "@nestjs/common"
import { ActivityLoggerInterceptor } from "../interceptors/activity-logger.interceptor"

export interface LogActivityOptions {
  action: string
  getMetadata?: (request: any, response: any) => Record<string, any>
  getUserId?: (request: any) => string | null
}

export function LogActivity(options: LogActivityOptions) {
  return applyDecorators(UseInterceptors(new ActivityLoggerInterceptor(options)))
}

