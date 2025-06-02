import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"
import { EventType } from "../enums/event-type.enum"
import { UserEventsService } from "../providers/user-events.service"

@Injectable()
export class EventLoggingInterceptor implements NestInterceptor {
  constructor(private readonly userEventsService: UserEventsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const startTime = Date.now()
    const { method, url, user, ip, headers } = request
    const userAgent = headers["user-agent"]

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now()
          const duration = endTime - startTime

          // Log specific events based on the endpoint
          this.logEventBasedOnEndpoint(method, url, user?.id, ip, userAgent, response.statusCode, duration, data)
        },
        error: (error) => {
          const endTime = Date.now()
          const duration = endTime - startTime

          // Log error events
          this.userEventsService
            .logEvent({
              userId: user?.id,
              eventType: EventType.ERROR_OCCURRED,
              description: `Error on ${method} ${url}: ${error.message}`,
              metadata: {
                method,
                url,
                statusCode: error.status || 500,
                duration,
                errorMessage: error.message,
                stack: error.stack,
              },
              ipAddress: ip,
              userAgent,
            })
            .catch(console.error)
        },
      }),
    )
  }

  private async logEventBasedOnEndpoint(
    method: string,
    url: string,
    userId: string,
    ip: string,
    userAgent: string,
    statusCode: number,
    duration: number,
    responseData: any,
  ) {
    try {
      let eventType: EventType | null = null
      let description = ""
      const metadata: Record<string, any> = {
        method,
        url,
        statusCode,
        duration,
      }

      // Map endpoints to event types
      if (url.includes("/puzzles") && method === "GET") {
        eventType = EventType.PUZZLE_OPENED
        description = "User opened a puzzle"
        metadata.puzzleId = this.extractIdFromUrl(url)
      } else if (url.includes("/puzzles") && method === "POST") {
        eventType = EventType.PUZZLE_COMPLETED
        description = "User completed a puzzle"
        metadata.puzzleId = this.extractIdFromUrl(url)
        metadata.success = statusCode === 200 || statusCode === 201
      } else if (url.includes("/hints") && method === "GET") {
        eventType = EventType.HINT_VIEWED
        description = "User viewed a hint"
        metadata.hintId = this.extractIdFromUrl(url)
      } else if (url.includes("/hints") && method === "POST") {
        eventType = EventType.HINT_USED
        description = "User used a hint"
        metadata.hintId = this.extractIdFromUrl(url)
      } else if (url.includes("/nfts") && method === "POST" && url.includes("claim")) {
        eventType = EventType.NFT_CLAIMED
        description = "User claimed an NFT"
        metadata.nftId = this.extractIdFromUrl(url)
      } else if (url.includes("/nfts") && method === "GET") {
        eventType = EventType.NFT_VIEWED
        description = "User viewed NFT details"
        metadata.nftId = this.extractIdFromUrl(url)
      } else if (url.includes("/auth/login") && method === "POST") {
        eventType = EventType.USER_LOGIN
        description = "User logged in"
        metadata.success = statusCode === 200
      } else if (url.includes("/auth/logout") && method === "POST") {
        eventType = EventType.USER_LOGOUT
        description = "User logged out"
      } else if (url.includes("/users") && method === "POST") {
        eventType = EventType.USER_REGISTERED
        description = "New user registered"
      } else if (url.includes("/level") && method === "POST") {
        eventType = EventType.LEVEL_COMPLETED
        description = "User completed a level"
        metadata.levelId = this.extractIdFromUrl(url)
      }

      // Only log if we have a relevant event type
      if (eventType && userId) {
        await this.userEventsService.logEvent({
          userId,
          eventType,
          description,
          metadata,
          ipAddress: ip,
          userAgent,
        })
      }
    } catch (error) {
      console.error("Error logging event:", error)
    }
  }

  private extractIdFromUrl(url: string): string | null {
    const matches = url.match(/\/([a-f\d-]{36}|\d+)(?:\/|$)/i)
    return matches ? matches[1] : null
  }
}
