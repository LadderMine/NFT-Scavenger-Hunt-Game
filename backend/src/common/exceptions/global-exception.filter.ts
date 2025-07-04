import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common"
import type { Response } from "express"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message: any = "Internal server error"

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      message = exception.getResponse()
    } else if (exception instanceof Error) {
      // Log the full error for debugging
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
      message = process.env.NODE_ENV === "production" ? "Internal server error" : exception.message
    }

    // Log the error details
    this.logger.error(`HTTP ${status} Error: ${JSON.stringify(message)} - ${request.method} ${request.url}`)

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    })
  }
}
